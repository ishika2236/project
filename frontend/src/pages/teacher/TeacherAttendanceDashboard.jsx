import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    const classStartTime = new Date(record.class.schedule?.startTime || record.markedAt);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// Student Details Modal Component
const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Student Details: {student.studentName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Student Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Classes</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{student.totalClasses}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Present</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{student.presentClasses}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Absent</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{student.absentClasses}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Late</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{student.lateClasses}</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Attendance Percentage
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {student.attendancePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                student.attendancePercentage >= 90 ? 'bg-green-600' :
                student.attendancePercentage >= 75 ? 'bg-yellow-400' : 'bg-red-600'
              }`}
              style={{ width: `${student.attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Attendance Records */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Attendance Records
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Late
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {student.records?.slice(0, 10).map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.classDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.classTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.isLate ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                          No
                        </span>
                      )}
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
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
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
  }, [classroomAttendance]);

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
      // dispatch(getClassroomsByTeacher(teacherId));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (teacherClassrooms?.length > 0 && !selectedClassroom) {
      setSelectedClassroom(teacherClassrooms[0]._id);
      // dispatch(getClassroomAttendance(teacherClassrooms[0]._id));
    }
  }, [teacherClassrooms, dispatch, selectedClassroom]);

  const handleClassroomChange = (e) => {
    const classroomId = e.target.value;
    setSelectedClassroom(classroomId);
    setSelectedClass(null);
    // dispatch(getClassroomAttendance(classroomId));
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

  if (!processedData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">No attendance data available for this selection.</p>
        </div>
      </div>
    );
  }

  const { stats, lowAttendanceStudents, lateStudents, studentSummaries, allRecords } = processedData;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Attendance Analytics Dashboard
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Classroom
          </label>
          <select 
            value={selectedClassroom || ''} 
            onChange={handleClassroomChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
          >
            {teacherClassrooms && teacherClassrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.name || `${classroom.course?.courseName || 'Unnamed Course'} - ${classroom.group?.name || 'Unnamed Group'}`}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            View Mode
          </label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed Analysis</option>
            <option value="analytics">Advanced Analytics</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Late Rate</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lateRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Attendance</p>
              <p className="text-2xl font-bold text-red-600">{lowAttendanceStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Attendance Overview</h2>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
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
              icon={<AlertTriangle className="text-red-600" size={20} />}
              defaultExpanded={lowAttendanceStudents.length > 0}
            >
              <div className="space-y-3">
                {lowAttendanceStudents.slice(0, itemsToShow).map((student, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{student.studentName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Roll: {student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{student.attendancePercentage}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {student.presentClasses}/{student.totalClasses} classes
                      </p>
                    </div>
                  </div>
                ))}
                {lowAttendanceStudents.length > itemsToShow && (
                  <button
                    onClick={() => setItemsToShow(itemsToShow + 10)}
                    className="w-full py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{student.studentName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Roll: {student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{student.maxConsecutiveLate} consecutive</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Present/Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Late Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {studentSummaries.slice(0, itemsToShow).map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendancePercentage >= 90 ? 'bg-green-600' :
                            student.attendancePercentage >= 75 ? 'bg-yellow-400' : 'bg-red-600'
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.attendancePercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {student.presentClasses}/{student.totalClasses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {student.lateClasses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
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
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={() => setItemsToShow(itemsToShow + 10)}
              className="w-full py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
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

export default TeacherAttendanceDashboard;