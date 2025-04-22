// components/views/AttendanceControl.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { Clock, QrCode, RefreshCw, Users, CheckCircle, XCircle } from 'lucide-react';

const AttendanceControl = ({ course, group, classItem }) => {
  const { themeConfig, theme } = useTheme();
  const [attendanceMode, setAttendanceMode] = useState('qrcode'); // 'qrcode', 'manual'
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [studentsPresent, setStudentsPresent] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    if (course && group && classItem) {
      // Mock API call for students data
      setTimeout(() => {
        const mockStudents = [
          { id: 1, name: 'Alex Johnson', email: 'alex.j@example.edu', status: null },
          { id: 2, name: 'Jamie Smith', email: 'jamie.s@example.edu', status: null },
          { id: 3, name: 'Casey Wong', email: 'casey.w@example.edu', status: null },
          { id: 4, name: 'Taylor Patel', email: 'taylor.p@example.edu', status: null },
          { id: 5, name: 'Morgan Lee', email: 'morgan.l@example.edu', status: null },
          { id: 6, name: 'Riley Garcia', email: 'riley.g@example.edu', status: null },
          { id: 7, name: 'Jordan Chen', email: 'jordan.c@example.edu', status: null },
          { id: 8, name: 'Cameron Nguyen', email: 'cameron.n@example.edu', status: null }
        ];
        setStudents(mockStudents);
        setTotalStudents(mockStudents.length);
        setLoading(false);
      }, 600);
    }
  }, [course, group, classItem]);

  // Session timer
  useEffect(() => {
    let timer;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAttendanceSession = () => {
    if (isSessionActive) {
      // End session
      setIsSessionActive(false);
      // Save attendance data logic would go here
    } else {
      // Start session
      setIsSessionActive(true);
      setSessionTime(0);
    }
  };

  const markAttendance = (studentId, status) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, status };
      }
      return student;
    }));
    
    // Update count of present students
    const presentCount = students.filter(s => s.id === studentId ? status === 'present' : s.status === 'present').length;
    setStudentsPresent(presentCount);
  };

  if (!course || !group || !classItem) {
    return (
      <div className={`p-8 text-center ${themeConfig[theme].secondaryText}`}>
        Please select a class to access attendance controls
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>Attendance Control</h2>
          <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
            {course.name} • {group.name} • {classItem.title}
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6`}>
        <div className={`md:col-span-2 ${themeConfig[theme].card} rounded-lg p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-medium text-lg ${themeConfig[theme].text}`}>Attendance Session</h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => setAttendanceMode('qrcode')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  attendanceMode === 'qrcode' 
                    ? themeConfig[theme].button.primary 
                    : theme === 'dark'
                      ? 'bg-[#121A22] border border-[#1E2733] text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                <QrCode size={16} className="mr-1 inline" />
                QR Code
              </button>
              <button 
                onClick={() => setAttendanceMode('manual')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  attendanceMode === 'manual' 
                    ? themeConfig[theme].button.primary 
                    : theme === 'dark'
                      ? 'bg-[#121A22] border border-[#1E2733] text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                <Users size={16} className="mr-1 inline" />
                Manual
              </button>
            </div>
          </div>

          {attendanceMode === 'qrcode' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className={`w-64 h-64 ${theme === 'dark' ? 'bg-white' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                {isSessionActive ? (
                  <div className="text-center">
                    <QrCode size={180} className="text-black mx-auto" />
                    <p className="text-sm text-black mt-2">Scan to mark attendance</p>
                  </div>
                ) : (
                  <p className={`text-center ${theme === 'dark' ? 'text-gray-800' : 'text-gray-500'}`}>
                    Start session to generate QR code
                  </p>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <p className={`text-sm ${themeConfig[theme].secondaryText} mb-2`}>
                  {isSessionActive ? 'Session Active' : 'Session Inactive'}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Clock size={18} className={`mr-2 ${isSessionActive ? 'text-green-500' : themeConfig[theme].secondaryText}`} />
                  <span className={`font-mono text-xl ${isSessionActive ? theme === 'dark' ? 'text-green-300' : 'text-green-600' : themeConfig[theme].text}`}>
                    {formatTime(sessionTime)}
                  </span>
                </div>
                
                <button 
                  onClick={toggleAttendanceSession}
                  className={`px-6 py-2 rounded-lg ${
                    isSessionActive 
                      ? theme === 'dark'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : 'bg-red-100 text-red-700 border border-red-300'
                      : themeConfig[theme].button.primary
                  }`}
                >
                  {isSessionActive ? 'End Session' : 'Start Session'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className={`h-12 animate-pulse rounded-lg ${theme === 'dark' ? 'bg-[#121A22]/60' : 'bg-gray-100'}`} 
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map(student => (
                    <div 
                      key={student.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${themeConfig[theme].text}`}>{student.name}</p>
                        <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{student.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => markAttendance(student.id, 'present')}
                          className={`p-2 rounded-full ${
                            student.status === 'present'
                              ? theme === 'dark'
                                ? 'bg-[#2F955A]/20 text-green-300'
                                : 'bg-green-100 text-green-700'
                              : theme === 'dark'
                                ? 'hover:bg-[#1E2733] text-gray-400'
                                : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => markAttendance(student.id, 'absent')}
                          className={`p-2 rounded-full ${
                            student.status === 'absent'
                              ? theme === 'dark'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-red-100 text-red-700'
                              : theme === 'dark'
                                ? 'hover:bg-[#1E2733] text-gray-400'
                                : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className={`${themeConfig[theme].card} rounded-lg p-6 mb-6`}>
            <h3 className={`font-medium mb-4 ${themeConfig[theme].text}`}>Session Stats</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Present</p>
                <p className={`text-2xl font-bold ${themeConfig[theme].text}`}>
                  {studentsPresent}/{totalStudents}
                  <span className={`text-sm ml-2 font-normal ${themeConfig[theme].secondaryText}`}>
                    ({totalStudents > 0 ? Math.round((studentsPresent / totalStudents) * 100) : 0}%)
                  </span>
                </p>
              </div>
              <div>
                <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Session Duration</p>
                <div className="flex items-center">
                  <Clock size={18} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                  <span className={`font-mono text-xl ${themeConfig[theme].text}`}>
                    {formatTime(sessionTime)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button 
                className={`w-full py-2 rounded-lg ${themeConfig[theme].button.primary}`}
                disabled={studentsPresent === 0}
              >
                Save Attendance
              </button>
            </div>
          </div>
          
          <div className={`${themeConfig[theme].card} rounded-lg p-6`}>
            <h3 className={`font-medium mb-4 ${themeConfig[theme].text}`}>Quick Actions</h3>
            <div className="space-y-3">
              <button 
                className={`w-full py-2 text-left px-3 rounded-lg flex items-center ${
                  theme === 'dark' ? 'bg-[#121A22] hover:bg-[#1E2733]' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <RefreshCw size={16} className="mr-2" />
                <span>Reset All Attendance</span>
              </button>
              <button 
                className={`w-full py-2 text-left px-3 rounded-lg flex items-center ${
                  theme === 'dark' ? 'bg-[#121A22] hover:bg-[#1E2733]' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                <span>Mark All Present</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceControl;
