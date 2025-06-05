import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ChevronDown, ChevronUp, Download, Users, Clock, AlertTriangle, X } from 'lucide-react';
import { 
  getClassroomAttendance, 
  getTeacherAttendance,
  getDailyAttendanceReport 
} from '../../app/features/attendanceStats/attendanceStatsThunks';
import { getClassroomsByTeacher } from '../../app/features/classroom/classroomThunks';
// Lazy loaded components
const StudentDetailsModal = lazy(() => import('../../components/teacher/modals/StudentDetailsModal'));
const LowAttendanceAlert = lazy(() => import('../../components/teacher/modals/LowAttendanceAlert'));
const LateStudentsPanel = lazy(() => import('../../components/teacher/modals/LateStudentsPanel'));
import { useTheme } from '../../context/ThemeProvider';

// AttendanceProcessor class (you can import this from your separate file)
class AttendanceProcessor {
  constructor(attendanceData) {
    this.data = attendanceData;
    this.flattenedRecords = this.flattenData();
  }

  flattenData() {
    const flattened = [];
    this.data.forEach(classGroup => {
      classGroup.records.forEach(record => {
        flattened.push({
          ...record,
          className: classGroup.className,
          studentName: `${record.student.firstName} ${record.student.lastName}`,
          rollNumber: record.student.rollNumber,
          classDate: new Date(record.markedAt).toDateString(),
          classTime: new Date(record.markedAt).toLocaleTimeString(),
          isLate: this.isStudentLate(record)
        });
      });
    });
    return flattened;
  }

  isStudentLate(record) {
    const markedTime = new Date(record.markedAt);
    const classStartTime = new Date(record.class?.schedule?.startTime || record.markedAt);
    return markedTime > classStartTime;
  }

  getStudentSummary(rollNumber) {
    const studentRecords = this.flattenedRecords.filter(
      record => record.rollNumber === rollNumber
    );

    if (studentRecords.length === 0) {
      return { error: 'Student not found' };
    }

    const totalClasses = studentRecords.length;
    const presentClasses = studentRecords.filter(r => r.status === 'present').length;
    const absentClasses = studentRecords.filter(r => r.status === 'absent').length;
    const lateClasses = studentRecords.filter(r => r.isLate).length;
    const attendancePercentage = ((presentClasses / totalClasses) * 100).toFixed(2);

    return {
      studentName: studentRecords[0].studentName,
      rollNumber: rollNumber,
      totalClasses,
      presentClasses,
      absentClasses,
      lateClasses,
      attendancePercentage: parseFloat(attendancePercentage),
      records: studentRecords.sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt))
    };
  }

  findLowAttendanceStudents(threshold = 75) {
    const studentStats = {};

    this.flattenedRecords.forEach(record => {
      const rollNumber = record.rollNumber;
      if (!studentStats[rollNumber]) {
        studentStats[rollNumber] = {
          studentName: record.studentName,
          rollNumber: rollNumber,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          lateClasses: 0
        };
      }

      studentStats[rollNumber].totalClasses++;
      if (record.status === 'present') {
        studentStats[rollNumber].presentClasses++;
      } else {
        studentStats[rollNumber].absentClasses++;
      }
      if (record.isLate) {
        studentStats[rollNumber].lateClasses++;
      }
    });

    const lowAttendanceStudents = Object.values(studentStats)
      .map(student => ({
        ...student,
        attendancePercentage: ((student.presentClasses / student.totalClasses) * 100).toFixed(2)
      }))
      .filter(student => parseFloat(student.attendancePercentage) < threshold)
      .sort((a, b) => parseFloat(a.attendancePercentage) - parseFloat(b.attendancePercentage));

    return lowAttendanceStudents;
  }

  findConsecutivelyLateStudents(consecutiveDays = 3) {
    const studentRecords = {};
    
    this.flattenedRecords.forEach(record => {
      const rollNumber = record.rollNumber;
      if (!studentRecords[rollNumber]) {
        studentRecords[rollNumber] = [];
      }
      studentRecords[rollNumber].push(record);
    });

    const consistentlyLateStudents = [];

    Object.entries(studentRecords).forEach(([rollNumber, records]) => {
      const sortedRecords = records.sort((a, b) => new Date(a.markedAt) - new Date(b.markedAt));
      
      let consecutiveLateCount = 0;
      let maxConsecutiveLate = 0;
      let currentStreak = [];
      let longestStreak = [];

      sortedRecords.forEach(record => {
        if (record.isLate && record.status === 'present') {
          consecutiveLateCount++;
          currentStreak.push(record);
          maxConsecutiveLate = Math.max(maxConsecutiveLate, consecutiveLateCount);
          
          if (consecutiveLateCount > longestStreak.length) {
            longestStreak = [...currentStreak];
          }
        } else {
          consecutiveLateCount = 0;
          currentStreak = [];
        }
      });

      if (maxConsecutiveLate >= consecutiveDays) {
        consistentlyLateStudents.push({
          studentName: records[0].studentName,
          rollNumber: rollNumber,
          maxConsecutiveLate: maxConsecutiveLate,
          longestLateStreak: longestStreak,
          totalLateClasses: records.filter(r => r.isLate).length,
          totalClasses: records.length
        });
      }
    });

    return consistentlyLateStudents.sort((a, b) => b.maxConsecutiveLate - a.maxConsecutiveLate);
  }

  getAttendanceStats(startDate = null, endDate = null) {
    let filteredRecords = this.flattenedRecords;

    if (startDate) {
      filteredRecords = filteredRecords.filter(record => 
        new Date(record.markedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredRecords = filteredRecords.filter(record => 
        new Date(record.markedAt) <= new Date(endDate)
      );
    }

    const totalRecords = filteredRecords.length;
    const presentCount = filteredRecords.filter(r => r.status === 'present').length;
    const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
    const lateCount = filteredRecords.filter(r => r.isLate).length;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate: ((presentCount / totalRecords) * 100).toFixed(2),
      lateRate: ((lateCount / totalRecords) * 100).toFixed(2),
      dateRange: {
        start: startDate,
        end: endDate
      }
    };
  }

  exportToCSV() {
    const headers = [
      'Student Name', 'Roll Number', 'Class Name', 'Date', 'Time', 
      'Status', 'Late', 'Face Recognized', 'Marked By'
    ];
    
    const csvData = [headers];
    
    this.flattenedRecords.forEach(record => {
      csvData.push([
        record.studentName,
        record.rollNumber,
        record.className,
        record.classDate,
        record.classTime,
        record.status,
        record.isLate ? 'Yes' : 'No',
        record.faceRecognized ? 'Yes' : 'No',
        record.markedBy
      ]);
    });
    
    return csvData.map(row => row.join(',')).join('\n');
  }
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Expandable section component
const ExpandableSection = ({ title, children, defaultExpanded = false, icon }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { themeConfig, theme } = useTheme();
  const config = themeConfig[theme];

  return (
    <div className={`${config.card} mb-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between text-left 
          ${theme === 'dark' 
            ? 'hover:bg-[#1A1D25]/50' 
            : 'hover:bg-slate-50'
          } 
          transition-all duration-300 ease-in-out rounded-t-lg`}
      >
        <div className="flex items-center space-x-3">
          <div className={config.icon}>
            {icon}
          </div>
          <h3 className={`text-lg font-semibold ${config.text}`}>
            {title}
          </h3>
        </div>
        <div className={`${config.secondaryText} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {isExpanded && (
        <div className={`px-6 pb-6 border-t ${
          theme === 'dark' 
            ? 'border-[#2E3441]' 
            : 'border-slate-200'
        }`}>
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};


// Student Details Modal Component
const StudentModal = ({ student, onClose }) => {
  const { themeConfig, theme } = useTheme();
  const config = themeConfig[theme];
  
  if (!student) return null;

  const getStatusBadgeStyle = (status) => {
    if (theme === 'dark') {
      return status === 'present' 
        ? 'bg-[#2F955A]/20 text-[#2F955A] border border-[#2F955A]/30'
        : 'bg-[#F2683C]/20 text-[#F2683C] border border-[#F2683C]/30';
    } else {
      return status === 'present'
        ? 'bg-[#31B7AF]/10 text-[#31B7AF] border border-[#31B7AF]/20'
        : 'bg-[#FF5A5A]/10 text-[#FF5A5A] border border-[#FF5A5A]/20';
    }
  };

  const getLateBadgeStyle = (isLate) => {
    if (theme === 'dark') {
      return isLate
        ? 'bg-[#F2683C]/20 text-[#F2683C] border border-[#F2683C]/30'
        : 'bg-[#5E6E82]/20 text-[#5E6E82] border border-[#5E6E82]/30';
    } else {
      return isLate
        ? 'bg-[#FF9F5A]/10 text-[#FF9F5A] border border-[#FF9F5A]/20'
        : 'bg-slate-100 text-slate-500 border border-slate-200';
    }
  };

  const getSummaryCardStyle = (type) => {
    if (theme === 'dark') {
      const styles = {
        total: 'bg-[#506EE5]/20 border border-[#506EE5]/30',
        present: 'bg-[#2F955A]/20 border border-[#2F955A]/30',
        absent: 'bg-[#F2683C]/20 border border-[#F2683C]/30',
        late: 'bg-[#F2683C]/20 border border-[#F2683C]/30'
      };
      return styles[type];
    } else {
      const styles = {
        total: 'bg-[#4E8CEC]/10 border border-[#4E8CEC]/20',
        present: 'bg-[#31B7AF]/10 border border-[#31B7AF]/20',
        absent: 'bg-[#FF5A5A]/10 border border-[#FF5A5A]/20',
        late: 'bg-[#FF9F5A]/10 border border-[#FF9F5A]/20'
      };
      return styles[type];
    }
  };

  const getProgressBarColor = (percentage) => {
    if (theme === 'dark') {
      return percentage >= 90 ? 'bg-[#2F955A]' :
             percentage >= 75 ? 'bg-[#F2683C]' : 'bg-[#F2683C]';
    } else {
      return percentage >= 90 ? 'bg-[#31B7AF]' :
             percentage >= 75 ? 'bg-[#FF9F5A]' : 'bg-[#FF5A5A]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${config.card} rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${config.text}`}>
            Student Details: {student.studentName}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 ${theme === 'dark' ? 'hover:bg-[#1A1D25]/50' : 'hover:bg-slate-100'} rounded-full transition-colors`}
          >
            <X size={20} className={config.secondaryText} />
          </button>
        </div>

        {/* Student Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${getSummaryCardStyle('total')} rounded-lg p-4`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#506EE5]' : 'text-[#4E8CEC]'}`}>
              Total Classes
            </p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#506EE5]' : 'text-[#4E8CEC]'}`}>
              {student.totalClasses}
            </p>
          </div>
          <div className={`${getSummaryCardStyle('present')} rounded-lg p-4`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#2F955A]' : 'text-[#31B7AF]'}`}>
              Present
            </p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#2F955A]' : 'text-[#31B7AF]'}`}>
              {student.presentClasses}
            </p>
          </div>
          <div className={`${getSummaryCardStyle('absent')} rounded-lg p-4`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#F2683C]' : 'text-[#FF5A5A]'}`}>
              Absent
            </p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#F2683C]' : 'text-[#FF5A5A]'}`}>
              {student.absentClasses}
            </p>
          </div>
          <div className={`${getSummaryCardStyle('late')} rounded-lg p-4`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#F2683C]' : 'text-[#FF9F5A]'}`}>
              Late
            </p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#F2683C]' : 'text-[#FF9F5A]'}`}>
              {student.lateClasses}
            </p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${config.secondaryText}`}>
              Attendance Percentage
            </span>
            <span className={`text-sm font-medium ${config.text}`}>
              {student.attendancePercentage}%
            </span>
          </div>
          <div className={`w-full ${theme === 'dark' ? 'bg-[#2E3441]' : 'bg-slate-200'} rounded-full h-3`}>
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(student.attendancePercentage)}`}
              style={{ width: `${student.attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Attendance Records */}
        <div>
          <h3 className={`text-lg font-semibold ${config.text} mb-4`}>
            Recent Attendance Records
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={config.table.header}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Late
                  </th>
                </tr>
              </thead>
              <tbody className={`${config.background} divide-y ${theme === 'dark' ? 'divide-[#2E3441]' : 'divide-slate-200'}`}>
                {student.records?.slice(0, 10).map((record, index) => (
                  <tr key={index} className={config.table.row}>
                    <td className={`${config.table.cell} whitespace-nowrap text-sm ${config.text}`}>
                      {record.classDate}
                    </td>
                    <td className={`${config.table.cell} whitespace-nowrap text-sm ${config.text}`}>
                      {record.classTime}
                    </td>
                    <td className={`${config.table.cell} whitespace-nowrap text-sm ${config.text}`}>
                      {record.class?.title || 'Untitled Class'}
                    </td>
                    <td className={`${config.table.cell} whitespace-nowrap`}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className={`${config.table.cell} whitespace-nowrap`}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLateBadgeStyle(record.isLate)}`}>
                        {record.isLate ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`${config.button.secondary} px-4 py-2`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



const TeacherAttendanceDashboard = () => {
  const dispatch = useDispatch();
  const { themeConfig, theme } = useTheme(); // Use your theme
  const currentTheme = themeConfig[theme]; // Get current theme config

  const { teacherClassrooms } = useSelector((state) => state.classrooms);
  const { classroomAttendance, isLoading } = useSelector((state) => state.attendanceStats);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, analytics
  const [itemsToShow, setItemsToShow] = useState(10);
  const { user } = useSelector(state => state.auth);
  
  const COLORS = ['#0088FE', '#00C49F', '#FF8042', '#FFBB28'];
  const teacherId = user?._id;

  // Initialize AttendanceProcessor with current data
  const attendanceProcessor = useMemo(() => {
    if (!classroomAttendance || !classroomAttendance.recordsByClass) return null;
    
    // Transform the data to match the expected format
    const transformedData = Object.entries(classroomAttendance.recordsByClass || {}).map(([className, classData]) => ({
      className,
      records: classData.records || []
    }));
    
    return transformedData.length > 0 ? new AttendanceProcessor(transformedData) : null;
  }, [classroomAttendance, classroomAttendance?.recordsByClass]);

  // Get processed data using AttendanceProcessor
  const processedData = useMemo(() => {
    if (!attendanceProcessor) return null;

    const stats = attendanceProcessor.getAttendanceStats();
    const lowAttendanceStudents = attendanceProcessor.findLowAttendanceStudents(75);
    const lateStudents = attendanceProcessor.findConsecutivelyLateStudents(2);

    // Get student summaries for table
    const uniqueStudents = [...new Set(attendanceProcessor.flattenedRecords.map(r => r.rollNumber))];
    const studentSummaries = uniqueStudents.map(rollNumber => 
      attendanceProcessor.getStudentSummary(rollNumber)
    ).filter(summary => !summary.error);

    return {
      stats,
      lowAttendanceStudents,
      lateStudents,
      studentSummaries,
      allRecords: attendanceProcessor.flattenedRecords
    };
  }, [attendanceProcessor]);

  useEffect(() => {
    if (teacherId) {
      dispatch(getClassroomsByTeacher(teacherId));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (teacherClassrooms?.length > 0 && !selectedClassroom) {
      setSelectedClassroom(teacherClassrooms[0]._id);
      dispatch(getClassroomAttendance(teacherClassrooms[0]._id));
    }
  }, [teacherClassrooms, dispatch, selectedClassroom]);

  const handleClassroomChange = (e) => {
    const classroomId = e.target.value;
    setSelectedClassroom(classroomId);
    setSelectedClass(null);
    dispatch(getClassroomAttendance(classroomId));
  };

  const handleExportCSV = () => {
    if (!attendanceProcessor) return;
    
    const csvData = attendanceProcessor.exportToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  {console.log(processedData)}
  if (!processedData) {
    return (
      <div className={`p-6 ${currentTheme.background} min-h-screen`}>
        <div className={`${currentTheme.card} p-4`}>
          <p className={`${currentTheme.secondaryText}`}>No attendance data available for this selection.</p>
        </div>
      </div>
    );
  }

  const { stats, lowAttendanceStudents, lateStudents, studentSummaries, allRecords } = processedData;

  return (
    <div className={`p-6 ${currentTheme.background} min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
          Attendance Analytics Dashboard
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className={`flex items-center space-x-2 px-4 py-2 ${currentTheme.button.primary}`}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-64">
          <label className={`block text-sm font-medium ${currentTheme.secondaryText} mb-1`}>
            Select Classroom
          </label>
          <select 
            value={selectedClassroom || ''} 
            onChange={handleClassroomChange}
            className={`w-full px-3 py-2 ${currentTheme.select}`}
          >
            {teacherClassrooms && teacherClassrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.name || `${classroom.course?.courseName || 'Unnamed Course'} - ${classroom.group?.name || 'Unnamed Group'}`}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className={`block text-sm font-medium ${currentTheme.secondaryText} mb-1`}>
            View Mode
          </label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className={`w-full px-3 py-2 ${currentTheme.select}`}
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed Analysis</option>
            <option value="analytics">Advanced Analytics</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${currentTheme.card} p-6`}>
          <div className="flex items-center">
            <Users className={`h-8 w-8 ${currentTheme.icon}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${currentTheme.secondaryText}`}>Total Records</p>
              <p className={`text-2xl font-bold ${currentTheme.text}`}>{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className={`${currentTheme.card} p-6`}>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${currentTheme.secondaryText}`}>Attendance Rate</p>
              <p className={`text-2xl font-bold ${currentTheme.table.accent1}`}>{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className={`${currentTheme.card} p-6`}>
          <div className="flex items-center">
            <Clock className={`h-8 w-8 text-yellow-600`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${currentTheme.secondaryText}`}>Late Rate</p>
              <p className={`text-2xl font-bold text-yellow-600`}>{stats.lateRate}%</p>
            </div>
          </div>
        </div>

        <div className={`${currentTheme.card} p-6`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-8 w-8 ${currentTheme.table.accent2}`} />
            <div className="ml-4">
              <p className={`text-sm font-medium ${currentTheme.secondaryText}`}>Low Attendance</p>
              <p className={`text-2xl font-bold ${currentTheme.table.accent2}`}>{lowAttendanceStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className={`${currentTheme.card} p-6 mb-8`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${currentTheme.text}`}>Attendance Overview</h2>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className={`px-3 py-2 ${currentTheme.select} text-sm`}
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Trend Line</option>
          </select>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: stats.presentCount },
                    { name: 'Absent', value: stats.absentCount },
                    { name: 'Late', value: stats.lateCount }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={studentSummaries.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="studentName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendancePercentage" name="Attendance %" fill="#0088FE" />
                <Bar dataKey="lateClasses" name="Late Classes" fill="#FF8042" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expandable Sections */}
      {viewMode !== 'overview' && (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            <ExpandableSection 
              title="Low Attendance Alert" 
              icon={<AlertTriangle className={`${currentTheme.table.accent2}`} size={20} />}
              defaultExpanded={lowAttendanceStudents.length > 0}
            >
              <div className="space-y-3">
                {lowAttendanceStudents.slice(0, itemsToShow).map((student, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 ${currentTheme.button.danger} rounded-lg`}>
                    <div>
                      <p className={`font-medium ${currentTheme.text}`}>{student.studentName}</p>
                      <p className={`text-sm ${currentTheme.secondaryText}`}>Roll: {student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${currentTheme.table.accent2}`}>{student.attendancePercentage}%</p>
                      <p className={`text-sm ${currentTheme.secondaryText}`}>
                        {student.presentClasses}/{student.totalClasses} classes
                      </p>
                    </div>
                  </div>
                ))}
                {lowAttendanceStudents.length > itemsToShow && (
                  <button
                    onClick={() => setItemsToShow(itemsToShow + 10)}
                    className={`w-full py-2 ${currentTheme.button.secondary} text-sm font-medium`}
                  >
                    View More ({lowAttendanceStudents.length - itemsToShow} remaining)
                  </button>
                )}
              </div>
            </ExpandableSection>

            <ExpandableSection 
              title="Consistently Late Students" 
              icon={<Clock className="text-yellow-600" size={20} />}
            >
              <div className="space-y-3">
                {lateStudents.slice(0, 5).map((student, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 ${currentTheme.button.orange} rounded-lg`}>
                    <div>
                      <p className={`font-medium ${currentTheme.text}`}>{student.studentName}</p>
                      <p className={`text-sm ${currentTheme.secondaryText}`}>Roll: {student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{student.maxConsecutiveLate} consecutive</p>
                      <p className={`text-sm ${currentTheme.secondaryText}`}>
                        {student.totalLateClasses} late classes total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>
          </Suspense>
        </>
      )}

      {/* Student Details Table */}
      <div className={`${currentTheme.card}`}>
        <div className={`px-6 py-4 ${currentTheme.table.header}`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Student Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${currentTheme.table.header}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Student
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Roll Number
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Attendance Rate
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Present/Total
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Late Classes
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${currentTheme.card} divide-y divide-gray-200`}>
              {studentSummaries.slice(0, itemsToShow).map((student, index) => (
                <tr key={index} className={`${currentTheme.table.row}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${currentTheme.text}`}>{student.studentName}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendancePercentage >= 90 ? 'bg-green-600' :
                            student.attendancePercentage >= 75 ? 'bg-yellow-400' : 'bg-red-600'
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${currentTheme.text}`}>
                        {student.attendancePercentage}%
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {student.presentClasses}/{student.totalClasses}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {student.lateClasses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className={`${currentTheme.table.accent1} hover:opacity-80`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {studentSummaries.length > itemsToShow && (
          <div className={`px-6 py-4 ${currentTheme.table.header}`}>
            <button
              onClick={() => setItemsToShow(itemsToShow + 10)}
              className={`w-full py-2 ${currentTheme.button.secondary} text-sm font-medium`}
            >
              Load More ({studentSummaries.length - itemsToShow} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
       {showStudentModal && selectedStudent && (
        <StudentModal student={selectedStudent} onClose={handleCloseModal} />
       )}
    </div>
  );
};

// export default TeacherAttendanceDashboard;

export default TeacherAttendanceDashboard;