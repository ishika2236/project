import React, { useEffect, useState } from 'react';
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
import { getClassroomsByTeacher } from '../../app/features/classroom/classroomThunks';
import { getClassroomAttendance } from '../../app/features/attendanceStats/attendanceStatsThunks';
import { useTheme } from '../../context/ThemeProvider';

const TeacherAttendanceDashboard = () => {
  const dispatch = useDispatch();
  const { teacherClassrooms } = useSelector((state) => state.classrooms);
  const { classroomAttendance, isLoading } = useSelector((state) => state.attendanceStats);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const { user } = useSelector(state => state.auth);
  const { themeConfig, theme, isDark } = useTheme();
  
  // Use themed colors from the theme provider
  const COLORS = isDark 
    ? ['#506EE5', '#2F955A', '#F2683C'] 
    : ['#0088FE', '#00C49F', '#FF8042'];
  
  const teacherId = user?._id;

  useEffect(() => {
    // Fetch teacher's classrooms
    if (teacherId) {
      dispatch(getClassroomsByTeacher(teacherId));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    // When classrooms are loaded, select the first one by default
    if (teacherClassrooms?.length > 0 && !selectedClassroom) {
      setSelectedClassroom(teacherClassrooms[0]._id);
      dispatch(getClassroomAttendance(teacherClassrooms[0]._id));
    }
  }, [teacherClassrooms, dispatch, selectedClassroom]);

  const handleClassroomChange = (e) => {
    const classroomId = e.target.value;
    setSelectedClassroom(classroomId);
    setSelectedClass(null); // Reset selected class when classroom changes
    dispatch(getClassroomAttendance(classroomId));
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Get selected class records
  const getSelectedClassRecords = () => {
    if (!classroomAttendance || !classroomAttendance.recordsByClass) return [];
    
    if (selectedClass && classroomAttendance.recordsByClass[selectedClass]) {
      return classroomAttendance.recordsByClass[selectedClass].records || [];
    }
    
    // If no class is selected, return all records from all classes
    return Object.values(classroomAttendance.recordsByClass || {})
      .flatMap(classData => classData.records || []);
  };

  // Format attendance data for charts
  const formatclassroomAttendance = () => {
    const records = getSelectedClassRecords();
    if (!records || records.length === 0) return [];

    // Group by student and calculate attendance percentage
    const studentAttendanceMap = {};
    
    records.forEach(record => {
      const studentName = `${record.student?.firstName || ''} ${record.student?.lastName || ''}`.trim();
      const studentId = record.student?._id || 'unknown';
      
      if (!studentAttendanceMap[studentId]) {
        studentAttendanceMap[studentId] = {
          studentId,
          studentName,
          rollNumber: record.student?.rollNumber || 'N/A',
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        };
      }
      
      studentAttendanceMap[studentId].total += 1;
      
      if (record.status === 'present') {
        studentAttendanceMap[studentId].present += 1;
      } else if (record.status === 'absent') {
        studentAttendanceMap[studentId].absent += 1;
      } else if (record.status === 'late') {
        studentAttendanceMap[studentId].late += 1;
      }
    });
    
    return Object.values(studentAttendanceMap).map(student => ({
      ...student,
      presentPercentage: (student.present / student.total) * 100,
      absentPercentage: (student.absent / student.total) * 100,
      latePercentage: (student.late / student.total) * 100
    }));
  };

  // Get overall attendance summary
  const getOverallAttendanceSummary = () => {
    const records = getSelectedClassRecords();
    if (!records || records.length === 0) return [];
    
    let present = 0;
    let absent = 0;
    let late = 0;
    
    records.forEach(record => {
      if (record.status === 'present') present++;
      else if (record.status === 'absent') absent++;
      else if (record.status === 'late') late++;
    });
    
    const total = present + absent + late;
    
    return [
      { name: 'Present', value: present, percentage: total > 0 ? (present / total) * 100 : 0 },
      { name: 'Absent', value: absent, percentage: total > 0 ? (absent / total) * 100 : 0 },
      { name: 'Late', value: late, percentage: total > 0 ? (late / total) * 100 : 0 }
    ];
  };

  // Format attendance data by date for line chart
  const formatAttendanceByDate = () => {
    const records = getSelectedClassRecords();
    if (!records || records.length === 0) return [];
    
    const dateMap = {};
    
    records.forEach(record => {
      const date = new Date(record.markedAt).toLocaleDateString();
      
      if (!dateMap[date]) {
        dateMap[date] = {
          date,
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        };
      }
      
      dateMap[date].total += 1;
      
      if (record.status === 'present') {
        dateMap[date].present += 1;
      } else if (record.status === 'absent') {
        dateMap[date].absent += 1;
      } else if (record.status === 'late') {
        dateMap[date].late += 1;
      }
    });
    
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get available classes for the selected classroom
  const getAvailableClasses = () => {
    if (!classroomAttendance || !classroomAttendance.recordsByClass) return [];
    return Object.values(classroomAttendance.recordsByClass);
  };
  const classroomAttendanceFormatted = formatclassroomAttendance();
  const overallSummary = getOverallAttendanceSummary();
  const attendanceByDate = formatAttendanceByDate();
  const availableClasses = getAvailableClasses();

  // Theme classes for consistency
  const cardClass = themeConfig[theme].card;
  const textClass = themeConfig[theme].text;
  const secondaryTextClass = themeConfig[theme].secondaryText;
  const backgroundClass = themeConfig[theme].background;
  const buttonPrimaryClass = themeConfig[theme].button.primary;
  const gradientTextClass = themeConfig[theme].gradient.text;

  return (
    <div className={`p-6 ${backgroundClass}`}>
      <h1 className={`text-2xl font-bold mb-6 ${gradientTextClass}`}>Classroom Attendance Dashboard</h1>
      
      {isLoading ? (
        <div className={`flex justify-center items-center h-64 ${cardClass} p-6`}>
          <p className={`text-lg ${textClass}`}>Loading attendance data...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="w-64">
              <label className={`block text-sm font-medium ${secondaryTextClass} mb-1`}>
                Select Classroom
              </label>
              <select 
                value={selectedClassroom || ''} 
                onChange={handleClassroomChange}
                className={`w-full px-3 py-2 ${isDark ? 'bg-[#121A22] border-[#1E2733]' : 'bg-white border-slate-200'} border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${textClass}`}
              >
                {teacherClassrooms && teacherClassrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name || `${classroom.course?.courseName || 'Unnamed Course'} - ${classroom.group?.name || 'Unnamed Group'}`}
                  </option>
                ))}
              </select>
            </div>
            {console.log(availableClasses)}
            {availableClasses.length > 0 && (
              <div className="w-64">
                <label className={`block text-sm font-medium ${secondaryTextClass} mb-1`}>
                  Filter by Class
                </label>
                <select 
                  value={selectedClass || ''} 
                  onChange={handleClassChange}
                  className={`w-full px-3 py-2 ${isDark ? 'bg-[#121A22] border-[#1E2733]' : 'bg-white border-slate-200'} border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${textClass}`}
                >
                  <option value="">All Classes</option>
                  {availableClasses.map((classId) => (
                    <option key={classId} value={classId}>
                      Class ID: {classId.className}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="w-64">
              <label className={`block text-sm font-medium ${secondaryTextClass} mb-1`}>
                Chart Type
              </label>
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className={`w-full px-3 py-2 ${isDark ? 'bg-[#121A22] border-[#1E2733]' : 'bg-white border-slate-200'} border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${textClass}`}
              >
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          
          {(!classroomAttendance || !getSelectedClassRecords().length) ? (
            <div className={`${isDark ? 'bg-[#121A22]/50 border-[#1E2733]' : 'bg-yellow-50 border-yellow-200'} border rounded-md p-4 mb-6`}>
              <p className={isDark ? textClass : 'text-yellow-700'}>No attendance data available for this selection.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`rounded-lg p-4 shadow ${cardClass}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>Present</h3>
                  <p className={`text-3xl font-bold ${isDark ? 'text-[#506EE5]' : 'text-blue-600'}`}>
                    {overallSummary.find(item => item.name === 'Present')?.percentage.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${secondaryTextClass} mt-1`}>
                    {overallSummary.find(item => item.name === 'Present')?.value} records
                  </p>
                </div>
                <div className={`rounded-lg p-4 shadow ${cardClass}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>Absent</h3>
                  <p className={`text-3xl font-bold ${isDark ? 'text-[#F2683C]' : 'text-red-600'}`}>
                    {overallSummary.find(item => item.name === 'Absent')?.percentage.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${secondaryTextClass} mt-1`}>
                    {overallSummary.find(item => item.name === 'Absent')?.value} records
                  </p>
                </div>
                <div className={`rounded-lg p-4 shadow ${cardClass}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>Late</h3>
                  <p className={`text-3xl font-bold ${isDark ? 'text-amber-500' : 'text-yellow-600'}`}>
                    {overallSummary.find(item => item.name === 'Late')?.percentage.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${secondaryTextClass} mt-1`}>
                    {overallSummary.find(item => item.name === 'Late')?.value} records
                  </p>
                </div>
              </div>
              
              <div className={`${cardClass} p-4 mb-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
                  {chartType === 'line' ? 'Attendance Trends Over Time' : 'Student Attendance Summary'}
                </h2>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' && classroomAttendanceFormatted.length > 0 && (
                      <BarChart
                        data={classroomAttendanceFormatted}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E2733' : '#e0e0e0'} />
                        <XAxis 
                          dataKey="studentName" 
                          angle={-45} 
                          textAnchor="end"
                          height={70} 
                          interval={0}
                          tick={{ fill: isDark ? '#ffffff' : '#333333' }}
                        />
                        <YAxis 
                          label={{ 
                            value: 'Percentage (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fill: isDark ? '#ffffff' : '#333333' } 
                          }}
                          tick={{ fill: isDark ? '#ffffff' : '#333333' }}
                        />
                        <Tooltip 
                          formatter={(value) => `${value.toFixed(1)}%`}
                          contentStyle={{ 
                            backgroundColor: isDark ? '#121A22' : '#fff',
                            borderColor: isDark ? '#1E2733' : '#ccc',
                            color: isDark ? '#ffffff' : '#333333'
                          }}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#ffffff' : '#333333' }}/>
                        <Bar dataKey="presentPercentage" name="Present" fill={COLORS[0]} />
                        <Bar dataKey="absentPercentage" name="Absent" fill={COLORS[2]} />
                        <Bar dataKey="latePercentage" name="Late" fill="#FFBB28" />
                      </BarChart>
                    )}
                    
                    {chartType === 'pie' && overallSummary.length > 0 && (
                      <PieChart>
                        <Pie
                          data={overallSummary}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        >
                          {overallSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [`${value} records`, props.payload.name]}
                          contentStyle={{ 
                            backgroundColor: isDark ? '#121A22' : '#fff',
                            borderColor: isDark ? '#1E2733' : '#ccc',
                            color: isDark ? '#ffffff' : '#333333'
                          }}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#ffffff' : '#333333' }}/>
                      </PieChart>
                    )}
                    
                    {chartType === 'line' && attendanceByDate.length > 0 && (
                      <LineChart
                        data={attendanceByDate}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E2733' : '#e0e0e0'} />
                        <XAxis 
                          dataKey="date" 
                          angle={-45} 
                          textAnchor="end"
                          height={70} 
                          interval={0}
                          tick={{ fill: isDark ? '#ffffff' : '#333333' }}
                        />
                        <YAxis tick={{ fill: isDark ? '#ffffff' : '#333333' }}/>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#121A22' : '#fff',
                            borderColor: isDark ? '#1E2733' : '#ccc',
                            color: isDark ? '#ffffff' : '#333333'
                          }}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#ffffff' : '#333333' }}/>
                        <Line type="monotone" dataKey="present" name="Present" stroke={COLORS[0]} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="absent" name="Absent" stroke={COLORS[2]} />
                        <Line type="monotone" dataKey="late" name="Late" stroke="#FFBB28" />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className={`${cardClass} overflow-hidden`}>
                <h2 className={`text-xl font-semibold p-4 border-b ${isDark ? 'border-[#1E2733]' : 'border-gray-200'} ${textClass}`}>Student Attendance Details</h2>
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y ${isDark ? 'divide-[#1E2733]' : 'divide-gray-200'}`}>
                    <thead className={isDark ? 'bg-[#121A22]' : 'bg-gray-50'}>
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Student Name
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Roll Number
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Present
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Absent
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Late
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                          Attendance Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${isDark ? 'bg-[#0A0E13]' : 'bg-white'} divide-y ${isDark ? 'divide-[#1E2733]' : 'divide-gray-200'}`}>
                      {classroomAttendanceFormatted.map((student, index) => (
                        <tr key={index} className={index % 2 === 0 ? (isDark ? 'bg-[#0A0E13]' : 'bg-white') : (isDark ? 'bg-[#121A22]' : 'bg-gray-50')}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textClass}`}>
                            {student.studentName || "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryTextClass}`}>
                            {student.rollNumber || "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryTextClass}`}>
                            {student.present} ({student.presentPercentage.toFixed(1)}%)
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryTextClass}`}>
                            {student.absent} ({student.absentPercentage.toFixed(1)}%)
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryTextClass}`}>
                            {student.late} ({student.latePercentage.toFixed(1)}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-full ${isDark ? 'bg-[#1E2733]' : 'bg-gray-200'} rounded-full h-2.5`}>
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    student.presentPercentage >= 90 
                                      ? (isDark ? 'bg-[#2F955A]' : 'bg-green-600')
                                      : student.presentPercentage >= 75 
                                        ? (isDark ? 'bg-amber-500' : 'bg-yellow-400')
                                        : (isDark ? 'bg-[#F2683C]' : 'bg-red-600')
                                  }`}
                                  style={{ width: `${student.presentPercentage}%` }}
                                ></div>
                              </div>
                              <span className={`ml-2 text-sm ${secondaryTextClass}`}>{student.presentPercentage.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherAttendanceDashboard;