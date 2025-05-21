import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  openAttendanceWindow,
  closeAttendanceWindow,
  markAttendanceManually,
  bulkMarkAttendance,
  getClassAttendance,
  getAttendanceWindowStatus
} from '../../app/features/attendance/attendanceThunks';
import { resetStatus } from '../../app/features/attendance/attendanceSlice';
import {
  Users,
  Clock,
  CheckCircle,
  X,
  Check,
  AlertTriangle,
  Calendar,
  FileText,
  Activity
} from 'lucide-react'
import { useTheme } from '../../context/ThemeProvider';

export default function ClassAttendanceController({ classItem }) {
  const dispatch = useDispatch();
  const {
    attendanceWindow,
    classAttendance,
    isLoading,
    isSuccess,
    isError,
    message
  } = useSelector((state) => state.attendance);
  
  // Import theme context
  const { themeConfig, theme, isDark } = useTheme();
  
  const [attendanceDuration, setAttendanceDuration] = useState(15); // Default 15 minutes
  const [activeTab, setActiveTab] = useState('status');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkAction, setBulkAction] = useState('present');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Fetch attendance window status and class attendance on component mount
  useEffect(() => {
    if (classItem?._id) {
      dispatch(getAttendanceWindowStatus(classItem._id));
      dispatch(getClassAttendance(classItem._id));
    }
  }, [dispatch, classItem]);
//   console.log(classAttendance);
  const fetchAttendance = () =>{
    dispatch(getClassAttendance(classItem._id))
    setTimeout(() => {
        fetchAttendance();
    }, 15000);
  }
  useEffect(()=>{
    fetchAttendance();
  },[])

  // Handle success/error notifications
  useEffect(() => {
    if (isSuccess) {
      setNotification({
        show: true,
        type: 'success',
        message: message || 'Operation successful'
      });
      
      // Refresh data after successful operations
      if (classItem?._id) {
        // dispatch(getAttendanceWindowStatus(classItem._id));
        // dispatch(getClassAttendance(classItem._id));
      }
      
      // Reset selection after bulk action
      if (selectedStudents.length > 0) {
        setSelectedStudents([]);
      }
      
      // Reset form state
      setNotes('');
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
        dispatch(resetStatus());
      }, 3000);
    }
    
    if (isError) {
      setNotification({
        show: true,
        type: 'error',
        message: message || 'An error occurred'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
        dispatch(resetStatus());
      }, 3000);
    }
  }, [isSuccess, isError, message, dispatch, classItem]);

  // Toggle student selection for bulk actions
  const toggleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Select all students
  const selectAllStudents = () => {
    if (classAttendance?.attendance?.length > 0) {
      if (selectedStudents.length === classAttendance.attendance.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(classAttendance.attendance.map(item => item.student._id));
      }
    }
  };

  // Handle opening attendance window
  const handleOpenAttendanceWindow = () => {
    dispatch(openAttendanceWindow({
      classId: classItem._id,
      duration: attendanceDuration
    }));
  };

  // Handle closing attendance window
  const handleCloseAttendanceWindow = () => {
    dispatch(closeAttendanceWindow(classItem._id));
  };

  // Handle marking attendance manually for a single student
  const handleMarkAttendance = (studentId, status) => {
    dispatch(markAttendanceManually({
      classId: classItem._id,
      studentId,
      status,
      notes
    }));
  };

  // Handle bulk marking attendance
  const handleBulkMarkAttendance = () => {
    if (selectedStudents.length === 0) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please select at least one student'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
      return;
    }
    
    const attendanceData = selectedStudents.map(studentId => ({
      studentId,
      status: bulkAction,
      notes
    }));
    
    dispatch(bulkMarkAttendance({
      classId: classItem._id,
      attendanceData
    }));
  };

  // Get status badge color based on theme and status
  const getStatusBadgeColor = (status) => {
    if (isDark) {
      switch (status) {
        case 'present':
          return 'bg-green-900/20 text-green-400 border-green-900/30';
        case 'absent':
          return 'bg-red-900/20 text-red-400 border-red-900/30';
        case 'late':
          return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
        case 'excused':
          return 'bg-blue-900/20 text-blue-400 border-blue-900/30';
        default:
          return 'bg-gray-800/50 text-gray-400 border-gray-700';
      }
    } else {
      switch (status) {
        case 'present':
          return 'bg-green-100 text-green-700 border-green-200';
        case 'absent':
          return 'bg-red-100 text-red-700 border-red-200';
        case 'late':
          return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'excused':
          return 'bg-blue-100 text-blue-700 border-blue-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  // Format remaining time
  const formatRemainingTime = () => {
    if (!attendanceWindow.isOpen || !attendanceWindow.closesAt) return '';
    
    const now = new Date();
    const closesAt = new Date(attendanceWindow.closesAt);
    const diffMs = closesAt - now;
    
    if (diffMs <= 0) return 'Closing...';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMins}:${diffSecs < 10 ? '0' + diffSecs : diffSecs}`;
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`${themeConfig[theme].card} overflow-hidden`}>
      {/* Notification */}
      {notification.show && (
        <div className={`p-3 ${notification.type === 'success' ? (isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700')} flex justify-between items-center`}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ show: false, type: '', message: '' })}
            className={`${themeConfig[theme].secondaryText} hover:opacity-80`}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className={`p-4 ${isDark ? themeConfig[theme].gradientBackground : 'bg-blue-600 text-white'}`}>
        <h3 className={`text-lg font-semibold ${isDark ? themeConfig[theme].text : 'text-white'}`}>
          Attendance Management
        </h3>
        <p className={`text-sm ${isDark ? themeConfig[theme].secondaryText : 'text-blue-100'}`}>
          {classItem.title} - {classItem.course?.courseName} ({classItem.course?.courseCode})
        </p>
      </div>

      {/* Attendance Window Controls */}
      <div className={`p-4 border-b ${isDark ? 'border-[#1E2733]' : 'border-gray-200'} ${isDark ? 'bg-[#121A22]/50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${themeConfig[theme].text}`}>Attendance Window</h4>
            <p className={`text-sm ${themeConfig[theme].secondaryText}`}>
              {attendanceWindow.isOpen ? (
                <span className={`flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  <CheckCircle size={16} className="mr-1" />
                  Open (Closes in {formatRemainingTime()})
                </span>
              ) : (
                <span className={`flex items-center ${themeConfig[theme].secondaryText}`}>
                  <Clock size={16} className="mr-1" />
                  Closed
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!attendanceWindow.isOpen ? (
              <>
                <select 
                  value={attendanceDuration}
                  onChange={(e) => setAttendanceDuration(parseInt(e.target.value))}
                  className={`px-3 py-2 ${isDark ? 'bg-[#121A22] border-[#1E2733] text-white' : 'border-gray-300 bg-white'} rounded-md text-sm`}
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
                <button
                  onClick={handleOpenAttendanceWindow}
                  disabled={isLoading}
                  className={`px-4 py-2 ${themeConfig[theme].button.primary} rounded-md text-sm disabled:opacity-50`}
                >
                  {isLoading ? 'Opening...' : 'Open Window'}
                </button>
              </>
            ) : (
              <button
                onClick={handleCloseAttendanceWindow}
                disabled={isLoading}
                className={`px-4 py-2 ${isDark ? themeConfig[theme].button.orange : 'bg-red-600 text-white hover:bg-red-700'} rounded-md text-sm disabled:opacity-50`}
              >
                {isLoading ? 'Closing...' : 'Close Window'}
              </button>
            )}
          </div>
        </div>
        
        {attendanceWindow.isOpen && (
          <div className={`mt-2 text-sm ${themeConfig[theme].secondaryText}`}>
            <p>Window opened at: {formatDateTime(attendanceWindow.openedAt)}</p>
            <p>Window closes at: {formatDateTime(attendanceWindow.closesAt)}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-[#1E2733]' : 'border-gray-200'}`}>
        <nav className="flex">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'status' ? 
              (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-blue-500 text-blue-600') : 
              (isDark ? 'text-white hover:text-[#506EE5]' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <div className="flex items-center">
              <Activity size={16} className="mr-2" />
              Attendance Status
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'manage' ? 
              (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-blue-500 text-blue-600') : 
              (isDark ? 'text-white hover:text-[#506EE5]' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              Mark Attendance
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'bulk' ? 
              (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-blue-500 text-blue-600') : 
              (isDark ? 'text-white hover:text-[#506EE5]' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2" />
              Bulk Actions
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Attendance Status Tab */}
        {activeTab === 'status' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-medium ${themeConfig[theme].text}`}>Attendance Summary</h4>
              <div className={`text-sm ${themeConfig[theme].secondaryText}`}>
                Total Students: {classAttendance?.stats?.total || 0}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className={isDark ? 
                'bg-gradient-to-br from-[#1A2520]/80 to-[#0A0E13]/90 border border-[#2F955A]/50 rounded-lg p-3 shadow-[inset_0_0_15px_rgba(47,149,90,0.3)]' : 
                'bg-green-50 border border-green-100 rounded-lg p-3'}>
                <div className={isDark ? 'text-green-400 font-medium' : 'text-green-600 font-medium'}>Present</div>
                <div className={isDark ? 'text-2xl font-bold text-green-400' : 'text-2xl font-bold text-green-700'}>
                  {classAttendance?.stats?.present || 0}
                </div>
              </div>
              <div className={isDark ? 
                'bg-gradient-to-br from-[#251A1A]/80 to-[#0A0E13]/90 border border-[#F2683C]/50 rounded-lg p-3 shadow-[inset_0_0_15px_rgba(242,104,60,0.3)]' : 
                'bg-red-50 border border-red-100 rounded-lg p-3'}>
                <div className={isDark ? 'text-red-400 font-medium' : 'text-red-600 font-medium'}>Absent</div>
                <div className={isDark ? 'text-2xl font-bold text-red-400' : 'text-2xl font-bold text-red-700'}>
                  {classAttendance?.stats?.absent || 0}
                </div>
              </div>
              <div className={isDark ? 
                'bg-gradient-to-br from-[#252114]/80 to-[#0A0E13]/90 border border-[#F2A93C]/50 rounded-lg p-3 shadow-[inset_0_0_15px_rgba(242,169,60,0.3)]' : 
                'bg-yellow-50 border border-yellow-100 rounded-lg p-3'}>
                <div className={isDark ? 'text-yellow-400 font-medium' : 'text-yellow-600 font-medium'}>Late</div>
                <div className={isDark ? 'text-2xl font-bold text-yellow-400' : 'text-2xl font-bold text-yellow-700'}>
                  {classAttendance?.stats?.late || 0}
                </div>
              </div>
              <div className={isDark ? 
                'bg-gradient-to-br from-[#14192A]/80 to-[#0A0E13]/90 border border-[#506EE5]/50 rounded-lg p-3 shadow-[inset_0_0_15px_rgba(80,110,229,0.3)]' : 
                'bg-blue-50 border border-blue-100 rounded-lg p-3'}>
                <div className={isDark ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'}>Excused</div>
                <div className={isDark ? 'text-2xl font-bold text-blue-400' : 'text-2xl font-bold text-blue-700'}>
                  {classAttendance?.stats?.excused || 0}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className={`font-medium mb-3 ${themeConfig[theme].text}`}>Status by Student</h4>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-[#506EE5]' : 'border-blue-500'}`}></div>
                </div>
              ) : classAttendance?.attendance?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className={`w-full text-sm ${themeConfig[theme].text}`}>
                    <thead className={isDark ? 'bg-[#121A22] text-white' : 'bg-gray-50 text-gray-600'}>
                      <tr>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Marked By</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-[#1E2733]' : 'divide-gray-200'}`}>
                        {console.log(classAttendance)}
                      {classAttendance.attendance.map((item) => (
                        <tr key={item.student._id} className={isDark ? 'hover:bg-[#121A22]/50' : 'hover:bg-gray-50'}>
                          <td className="px-4 py-3">
                            {item.student.firstName} {item.student.lastName}
                          </td>
                          <td className="px-4 py-3">
                            {item.attendance?.status ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(item.attendance.status)}`}>
                                {item.attendance.status.charAt(0).toUpperCase() + item.attendance.status.slice(1)}
                              </span>
                            ) : (
                              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Not marked</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.attendance?.markedBy ? (
                              <span className={themeConfig[theme].text}>
                                {item.attendance.markedBy === 'teacher' ? 'Teacher' : 
                                 item.attendance.markedBy === 'student' ? 'Student' : 
                                 item.attendance.markedBy === 'system' ? 'System' : 
                                 'Unknown'}
                              </span>
                            ) : (
                              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.attendance?.markedAt ? (
                              <span className={themeConfig[theme].text}>
                                {formatDateTime(item.attendance.markedAt)}
                              </span>
                            ) : (
                              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.attendance?.notes ? (
                              <span className={themeConfig[theme].text}>{item.attendance.notes}</span>
                            ) : (
                              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`text-center py-8 ${themeConfig[theme].secondaryText} ${isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'} rounded-lg`}>
                  No attendance data available
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mark Attendance Tab */}
        {activeTab === 'manage' && (
          <div>
            <div className="mb-4">
              <h4 className={`font-medium mb-2 ${themeConfig[theme].text}`}>Mark Individual Students</h4>
              <p className={`text-sm ${themeConfig[theme].secondaryText} mb-4`}>
                Select a student and mark their attendance status
              </p>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-[#506EE5]' : 'border-blue-500'}`}></div>
                </div>
              ) : classAttendance?.attendance?.length > 0 ? (
                <div className="space-y-3">
                  {classAttendance.attendance.map((item) => (
                    <div key={item.student._id} className={isDark ? 
                      'bg-[#121A22]/50 border border-[#1E2733] rounded-lg p-3' : 
                      'bg-gray-50 border border-gray-200 rounded-lg p-3'}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${themeConfig[theme].text}`}>{item.student.firstName} {item.student.lastName}</div>
                          <div className={`text-sm ${themeConfig[theme].secondaryText}`}>{item.student.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMarkAttendance(item.student._id, 'present')}
                            className={isDark ? 
                              'p-2 bg-[#1A2520]/80 text-green-400 hover:bg-green-900/30 rounded-md transition' : 
                              'p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition'}
                            title="Mark Present"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(item.student._id, 'absent')}
                            className={isDark ? 
                              'p-2 bg-[#251A1A]/80 text-red-400 hover:bg-red-900/30 rounded-md transition' : 
                              'p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition'}
                            title="Mark Absent"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(item.student._id, 'late')}
                            className={isDark ? 
                              'p-2 bg-[#252114]/80 text-yellow-400 hover:bg-yellow-900/30 rounded-md transition' : 
                              'p-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md transition'}
                            title="Mark Late"
                          >
                            <Clock size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(item.student._id, 'excused')}
                            className={isDark ? 
                              'p-2 bg-[#14192A]/80 text-blue-400 hover:bg-blue-900/30 rounded-md transition' : 
                              'p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition'}
                            title="Mark Excused"
                          >
                            <AlertTriangle size={18} />
                          </button>
                        </div>
                      </div>
                      {item.attendance?.status && (
                        <div className="mt-2 text-sm">
                          <span className={`font-medium ${themeConfig[theme].text}`}>Current Status:</span>{' '}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(item.attendance.status)}`}>
                            {item.attendance.status.charAt(0).toUpperCase() + item.attendance.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${themeConfig[theme].secondaryText} ${isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'} rounded-lg`}>
                  No students available
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className={`font-medium mb-2 ${themeConfig[theme].text}`}>Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about attendance (optional)"
                className={`w-full border rounded-md p-2 text-sm ${isDark ? 'bg-[#121A22] border-[#1E2733] text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Bulk Actions Tab */}
        {activeTab === 'bulk' && (
          <div>
            <div className="mb-4">
              <h4 className={`font-medium mb-2 ${themeConfig[theme].text}`}>Bulk Attendance Marking</h4>
              <p className={`text-sm ${themeConfig[theme].secondaryText} mb-4`}>
                Select multiple students and mark their attendance at once
              </p>
              
              <div className="mb-4 flex items-center gap-4">
                <div>
                  <label className={`block text-sm font-medium ${themeConfig[theme].text} mb-1`}>Action</label>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className={`w-40 border rounded-md p-2 text-sm ${isDark ? 'bg-[#121A22] border-[#1E2733] text-white' : 'border-gray-300 bg-white'}`}
                  >
                    <option value="present">Mark Present</option>
                    <option value="absent">Mark Absent</option>
                    <option value="late">Mark Late</option>
                    <option value="excused">Mark Excused</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className={`block text-sm font-medium ${themeConfig[theme].text} mb-1`}>Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                    className={`w-full border rounded-md p-2 text-sm ${isDark ? 'bg-[#121A22] border-[#1E2733] text-white placeholder-gray-500' : 'border-gray-300 bg-white'}`}
                  />
                </div>
                
                <div className="self-end">
                  <button
                    onClick={handleBulkMarkAttendance}
                    disabled={isLoading || selectedStudents.length === 0}
                    className={`px-4 py-2 ${themeConfig[theme].button.primary} rounded-md text-sm disabled:opacity-50`}
                  >
                    {isLoading ? 'Processing...' : 'Apply to Selected'}
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-[#506EE5]' : 'border-blue-500'}`}></div>
                </div>
              ) : classAttendance?.attendance?.length > 0 ? (
                <div className={`border rounded-lg overflow-hidden ${isDark ? 'border-[#1E2733]' : 'border-gray-200'}`}>
                  <div className={`px-4 py-2 border-b flex items-center ${isDark ? 'bg-[#121A22]/50 border-[#1E2733]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === classAttendance.attendance.length && classAttendance.attendance.length > 0}
                        onChange={selectAllStudents}
                        className={`h-4 w-4 rounded ${isDark ? 'bg-[#121A22] border-[#1E2733] text-[#506EE5]' : 'text-blue-600 border-gray-300'}`}
                      />
                      <span className={`ml-2 text-sm font-medium ${themeConfig[theme].text}`}>Select All</span>
                    </div>
                    <div className={`ml-4 text-sm ${themeConfig[theme].secondaryText}`}>
                      {selectedStudents.length} of {classAttendance.attendance.length} selected
                    </div>
                  </div>
                  <div className={`divide-y max-h-60 overflow-y-auto ${isDark ? 'divide-[#1E2733]' : 'divide-gray-200'}`}>
                    {classAttendance.attendance.map((item) => (
                      <div 
                        key={item.student._id} 
                        className={`px-4 py-2 flex items-center justify-between ${isDark ? 'hover:bg-[#121A22]/50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(item.student._id)}
                            onChange={() => toggleSelectStudent(item.student._id)}
                            className={`h-4 w-4 rounded ${isDark ? 'bg-[#121A22] border-[#1E2733] text-[#506EE5]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <div className="ml-3">
                            <div className={`font-medium text-sm ${themeConfig[theme].text}`}>{item.student.firstName} {item.student.lastName}</div>
                            <div className={`text-xs ${themeConfig[theme].secondaryText}`}>{item.student.email}</div>
                          </div>
                        </div>
                        {item.attendance?.status && (
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(item.attendance.status)}`}>
                              {item.attendance.status.charAt(0).toUpperCase() + item.attendance.status.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${themeConfig[theme].secondaryText} ${isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'} rounded-lg`}>
                  No students available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}