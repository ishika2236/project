
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider'; 
import { Bell, Calendar, BookOpen, FileText, CheckCircle, ChevronDown, ChevronRight, Clock, UserCheck, Map, User } from 'lucide-react';
import AttendanceModal from '../../components/student/AttendanceModal';

const StudentClassroomPortal = () => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  
  // Sample data - in a real app these would come from your API
  const [courses, setCourses] = useState([
    { id: 1, name: "Advanced Web Development", department: "Computer Science", schedule: "Mon, Wed 10:00-11:30", faculty: "Dr. Sarah Johnson" },
    { id: 2, name: "Database Systems", department: "Computer Science", schedule: "Tue, Thu 13:00-14:30", faculty: "Prof. Michael Chen" },
    { id: 3, name: "UI/UX Design Principles", department: "Design", schedule: "Wed, Fri 09:00-10:30", faculty: "Ms. Emily Parker" },
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 1, courseId: 1, title: "React Hooks Deep Dive", date: "Today, 10:00 AM", room: "CS Lab 3", attended: false },
    { id: 2, courseId: 2, title: "SQL Optimization", date: "Tomorrow, 1:00 PM", room: "CS Lab 2", attended: false },
    { id: 3, courseId: 3, title: "User Testing Methods", date: "Wed, 9:00 AM", room: "Design Studio", attended: false },
    { id: 4, courseId: 1, title: "State Management", date: "Friday, 10:00 AM", room: "CS Lab 3", attended: false },
  ]);
  
  const [sharedNotes, setSharedNotes] = useState([
    { id: 1, courseId: 1, title: "React Component Lifecycle", date: "May 1, 2025", fileType: "PDF" },
    { id: 2, courseId: 1, title: "Custom Hooks Examples", date: "Apr 28, 2025", fileType: "PDF" },
    { id: 3, courseId: 2, title: "Query Optimization Techniques", date: "Apr 25, 2025", fileType: "PPTX" },
  ]);
  
  const [assignments, setAssignments] = useState([
    { id: 1, courseId: 1, title: "Build a Theme Switcher Component", dueDate: "May 10, 2025", submitted: false },
    { id: 2, courseId: 2, title: "Database Schema Design Project", dueDate: "May 15, 2025", submitted: false },
    { id: 3, courseId: 3, title: "User Interface Mockup", dueDate: "May 12, 2025", submitted: true },
  ]);
  
  // Filtered data based on selected course
  const filteredClasses = selectedCourse 
    ? upcomingClasses.filter(c => c.courseId === selectedCourse.id)
    : upcomingClasses;
    
  const filteredNotes = selectedCourse
    ? sharedNotes.filter(n => n.courseId === selectedCourse.id)
    : [];
    
  const filteredAssignments = selectedCourse
    ? assignments.filter(a => a.courseId === selectedCourse.id)
    : [];
  
  // Handle class attendance
  const markAttendance = (classId) => {
    setUpcomingClasses(upcomingClasses.map(c => 
      c.id === classId ? {...c, attended: true} : c
    ));
  };
  
  // Mark attendance mockup with face recognition and geo-tracking
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceState, setAttendanceState] = useState('initial'); // initial, scanning, success, error
  const [currentClassForAttendance, setCurrentClassForAttendance] = useState(null);
  
  const initiateAttendance = (classItem) => {
    setCurrentClassForAttendance(classItem);
    setShowAttendanceModal(true);
    setAttendanceState('initial');
  };
  
  const startAttendanceProcess = () => {
    setAttendanceState('scanning');
    
    // Simulate face recognition and geo-tracking process
    setTimeout(() => {
      setAttendanceState('success');
      if (currentClassForAttendance) {
        markAttendance(currentClassForAttendance.id);
      }
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
     

      <div className="container mx-auto py-6 px-4">
        {/* Main content */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.gradient.text}`}>
            My Classrooms
          </h2>
          
          {/* Course cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`${currentTheme.card} p-6 rounded-xl cursor-pointer transform transition-all duration-300 ${
                  selectedCourse?.id === course.id 
                    ? 'scale-105 ring-2 ring-blue-500' 
                    : 'hover:scale-105'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-bold text-lg ${currentTheme.text}`}>{course.name}</h3>
                  {selectedCourse?.id === course.id ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : null}
                </div>
                <p className={`text-sm ${currentTheme.secondaryText} mb-3`}>{course.department}</p>
                <div className="flex items-center text-sm mb-2">
                  <Clock className={`h-4 w-4 mr-2 ${currentTheme.secondaryText}`} />
                  <span className={currentTheme.secondaryText}>{course.schedule}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className={`h-4 w-4 mr-2 ${currentTheme.secondaryText}`} />
                  <span className={currentTheme.secondaryText}>{course.faculty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected classroom content - Full page approach */}
        {selectedCourse && (
          <div className={`${currentTheme.gradientBackground} rounded-xl overflow-hidden min-h-screen`}>
            {/* Classroom header */}
            <div className={`p-6 ${isDark ? 'bg-gray-800/80' : 'bg-indigo-100/80'} backdrop-blur-sm border-b ${isDark ? 'border-gray-700' : 'border-indigo-200'} sticky top-0 z-10`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-bold ${currentTheme.gradient.text}`}>
                    {selectedCourse.name} Classroom
                  </h2>
                  <p className={`text-sm ${currentTheme.secondaryText}`}>
                    {selectedCourse.department} • {selectedCourse.faculty}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className={`${currentTheme.button.subtle || (isDark ? 'bg-gray-700 text-white' : 'bg-indigo-50 text-indigo-700')} px-4 py-2 rounded-lg text-sm`}
                >
                  Back to Classrooms
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 sm:justify-start sm:space-x-6">
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'schedule' 
                      ? isDark 
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
                        : 'bg-white text-indigo-700 shadow-md border border-indigo-100' 
                      : currentTheme.secondaryText
                  }`}
                >
                  <Calendar className={`h-5 w-5 ${activeTab === 'schedule' ? (isDark ? 'text-blue-400' : 'text-indigo-600') : ''}`} />
                  <span className="text-sm mt-1">Schedule</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'notes' 
                      ? isDark 
                        ? 'bg-purple-900/30 text-purple-400 border border-purple-800' 
                        : 'bg-white text-purple-700 shadow-md border border-purple-100' 
                      : currentTheme.secondaryText
                  }`}
                >
                  <FileText className={`h-5 w-5 ${activeTab === 'notes' ? (isDark ? 'text-purple-400' : 'text-purple-600') : ''}`} />
                  <span className="text-sm mt-1">Notes</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('assignments')}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'assignments' 
                      ? isDark 
                        ? 'bg-amber-900/30 text-amber-400 border border-amber-800' 
                        : 'bg-white text-amber-700 shadow-md border border-amber-100' 
                      : currentTheme.secondaryText
                  }`}
                >
                  <BookOpen className={`h-5 w-5 ${activeTab === 'assignments' ? (isDark ? 'text-amber-400' : 'text-amber-600') : ''}`} />
                  <span className="text-sm mt-1">Assignments</span>
                </button>
              </div>
            </div>

            {/* Page content */}
            <div className="container mx-auto py-8 px-4 md:px-6">
              {/* Schedule Page */}
              {activeTab === 'schedule' && (
                <div className="space-y-8">
                  {/* Page header */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Class Schedule</h1>
                    <p className={`${currentTheme.secondaryText}`}>All your upcoming classes for {selectedCourse.name}</p>
                  </div>
                  
                  {/* Today's classes */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Today's Classes</h2>
                    
                    {filteredClasses.filter(c => c.date.includes('Today')).length > 0 ? (
                      <div className="space-y-4">
                        {filteredClasses.filter(c => c.date.includes('Today')).map(classItem => (
                          <div 
                            key={classItem.id} 
                            className={`${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} p-4 rounded-lg shadow-sm border ${isDark ? 'border-blue-900/30' : 'border-blue-200'} flex justify-between items-center`}
                          >
                            <div className="flex items-center">
                              <div className={`${isDark ? 'bg-blue-800/50' : 'bg-blue-100'} h-12 w-12 rounded-full flex items-center justify-center mr-4`}>
                                <Clock className={`h-6 w-6 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
                              </div>
                              <div>
                                <h4 className={`font-medium ${currentTheme.text} text-lg`}>{classItem.title}</h4>
                                <div className="flex mt-2 text-sm space-x-4">
                                  <div className="flex items-center">
                                    <Clock className={`h-4 w-4 mr-1 ${currentTheme.secondaryText}`} />
                                    <span className={currentTheme.secondaryText}>{classItem.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Map className={`h-4 w-4 mr-1 ${currentTheme.secondaryText}`} />
                                    <span className={currentTheme.secondaryText}>{classItem.room}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {classItem.attended ? (
                              <span className={`px-4 py-2 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'} flex items-center`}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Present
                              </span>
                            ) : (
                              <button 
                                onClick={() => initiateAttendance(classItem)}
                                className={currentTheme.button.primary + " px-4 py-2 flex items-center"}
                              >
                                <UserCheck className="h-5 w-5 mr-2" />
                                Mark Attendance
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                        <Calendar className={`h-12 w-12 mx-auto mb-3 ${currentTheme.secondaryText}`} />
                        <p className={`${currentTheme.text} font-medium`}>No classes scheduled for today</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Upcoming classes */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Upcoming Classes</h2>
                    
                    {filteredClasses.filter(c => !c.date.includes('Today')).length > 0 ? (
                      <div className="space-y-4">
                        {filteredClasses.filter(c => !c.date.includes('Today')).map(classItem => (
                          <div 
                            key={classItem.id} 
                            className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg shadow-sm border ${isDark ? 'border-gray-600' : 'border-gray-200'} flex justify-between items-center`}
                          >
                            <div className="flex items-center">
                              <div className={`${isDark ? 'bg-gray-600' : 'bg-gray-200'} h-12 w-12 rounded-full flex items-center justify-center mr-4`}>
                                <Calendar className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                              </div>
                              <div>
                                <h4 className={`font-medium ${currentTheme.text} text-lg`}>{classItem.title}</h4>
                                <div className="flex mt-2 text-sm space-x-4">
                                  <div className="flex items-center">
                                    <Clock className={`h-4 w-4 mr-1 ${currentTheme.secondaryText}`} />
                                    <span className={currentTheme.secondaryText}>{classItem.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Map className={`h-4 w-4 mr-1 ${currentTheme.secondaryText}`} />
                                    <span className={currentTheme.secondaryText}>{classItem.room}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {classItem.attended ? (
                              <span className={`px-4 py-2 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'} flex items-center`}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Present
                              </span>
                            ) : (
                              <button 
                                className={`${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-lg text-sm flex items-center`}
                                disabled
                              >
                                <Clock className="h-5 w-5 mr-2" />
                                Upcoming
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                        <Calendar className={`h-12 w-12 mx-auto mb-3 ${currentTheme.secondaryText}`} />
                        <p className={`${currentTheme.text} font-medium`}>No upcoming classes scheduled</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Regular schedule */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Regular Schedule</h2>
                    <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex items-center">
                        <div className={`${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} p-2 rounded-lg mr-3`}>
                          <Clock className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-700'}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${currentTheme.text}`}>{selectedCourse.name}</h4>
                          <p className={`${currentTheme.secondaryText}`}>{selectedCourse.schedule}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Page */}
              {activeTab === 'notes' && (
                <div className="space-y-8">
                  {/* Page header */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Shared Notes</h1>
                    <p className={`${currentTheme.secondaryText}`}>Course materials shared by {selectedCourse.faculty}</p>
                  </div>
                  
                  {/* Recent notes */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-xl font-bold ${currentTheme.text}`}>Recent Notes</h2>
                      
                      <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center px-3 py-1`}>
                        <input 
                          type="text" 
                          placeholder="Search notes..." 
                          className={`bg-transparent border-none focus:outline-none ${currentTheme.text} placeholder:${currentTheme.secondaryText} text-sm`}
                        />
                      </div>
                    </div>
                    
                    {filteredNotes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredNotes.map(note => (
                          <div 
                            key={note.id} 
                            className={`${isDark ? 'bg-purple-900/20' : 'bg-purple-50'} p-5 rounded-xl shadow-sm border ${isDark ? 'border-purple-900/30' : 'border-purple-200'} transition-all duration-300 hover:shadow-md group cursor-pointer`}
                          >
                            <div className="flex items-start">
                              <div className={`${isDark ? 'bg-purple-800/50' : 'bg-purple-100'} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}>
                                <FileText className={`h-5 w-5 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${currentTheme.text} text-lg mb-1`}>{note.title}</h4>
                                <p className={`text-sm ${currentTheme.secondaryText}`}>Shared on {note.date}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-200 text-purple-800'}`}>
                                {note.fileType}
                              </span>
                              <button className={`${isDark ? 'bg-purple-800/50 text-purple-300 hover:bg-purple-700/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} px-3 py-1 rounded-lg text-sm flex items-center`}>
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                        <FileText className={`h-12 w-12 mx-auto mb-3 ${currentTheme.secondaryText}`} />
                        <p className={`${currentTheme.text} font-medium`}>No notes have been shared yet</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Video lectures */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Video Lectures</h2>
                    <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                      <div className={`${isDark ? 'bg-gray-600' : 'bg-gray-200'} h-12 w-12 mx-auto mb-3 rounded-full flex items-center justify-center`}>
                        <Clock className={`h-6 w-6 ${currentTheme.secondaryText}`} />
                      </div>
                      <p className={`${currentTheme.text} font-medium`}>No video lectures available</p>
                      <p className={`${currentTheme.secondaryText} text-sm mt-1`}>Check back later for recorded lectures</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignments Page */}
              {activeTab === 'assignments' && (
                <div className="space-y-8">
                  {/* Page header */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Assignments & Homework</h1>
                    <p className={`${currentTheme.secondaryText}`}>Tasks, assignments and homework for {selectedCourse.name}</p>
                  </div>
                  
                  {/* Pending assignments */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Pending Assignments</h2>
                    
                    {filteredAssignments.filter(a => !a.submitted).length > 0 ? (
                      <div className="space-y-4">
                        {filteredAssignments.filter(a => !a.submitted).map(assignment => (
                          <div 
                            key={assignment.id} 
                            className={`${isDark ? 'bg-amber-900/20' : 'bg-amber-50'} p-5 rounded-xl shadow-sm border ${isDark ? 'border-amber-900/30' : 'border-amber-200'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                              <div className={`${isDark ? 'bg-amber-800/50' : 'bg-amber-100'} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}>
                                  <BookOpen className={`h-5 w-5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} />
                                </div>
                                <div>
                                  <h4 className={`font-medium ${currentTheme.text} text-lg mb-1`}>{assignment.title}</h4>
                                  <p className={`text-sm ${currentTheme.secondaryText}`}>Due: {assignment.dueDate}</p>
                                </div>
                              </div>
                              
                              <button className={`${currentTheme.button.primary} px-4 py-2 rounded-lg text-sm mt-4 md:mt-0`}>
                                Submit Assignment
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                        <CheckCircle className={`h-12 w-12 mx-auto mb-3 ${currentTheme.secondaryText}`} />
                        <p className={`${currentTheme.text} font-medium`}>No pending assignments</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Completed assignments */}
                  <div className={`${isDark ? 'bg-gray-800/60' : 'bg-white'} p-6 rounded-xl shadow-md border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Completed Assignments</h2>
                    
                    {filteredAssignments.filter(a => a.submitted).length > 0 ? (
                      <div className="space-y-4">
                        {filteredAssignments.filter(a => a.submitted).map(assignment => (
                          <div 
                            key={assignment.id} 
                            className={`${isDark ? 'bg-green-900/20' : 'bg-green-50'} p-5 rounded-xl shadow-sm border ${isDark ? 'border-green-900/30' : 'border-green-200'}`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-start">
                                <div className={`${isDark ? 'bg-green-800/50' : 'bg-green-100'} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}>
                                  <CheckCircle className={`h-5 w-5 ${isDark ? 'text-green-300' : 'text-green-700'}`} />
                                </div>
                                <div>
                                  <h4 className={`font-medium ${currentTheme.text} text-lg mb-1`}>{assignment.title}</h4>
                                  <p className={`text-sm ${currentTheme.secondaryText}`}>Submitted</p>
                                </div>
                              </div>
                              
                              <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-200 text-green-800'}`}>
                                Completed
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-8 rounded-lg text-center`}>
                        <BookOpen className={`h-12 w-12 mx-auto mb-3 ${currentTheme.secondaryText}`} />
                        <p className={`${currentTheme.text} font-medium`}>No completed assignments yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <AttendanceModal
            isOpen={showAttendanceModal}
            onClose={() => setShowAttendanceModal(false)}
            classItem={currentClassForAttendance}
            onSuccessfulAttendance={(classId) => {
                markAttendance(classId);
                setShowAttendanceModal(false);
            }}
            isDark={isDark}
            />

          </div>
        // </div>

        
      )}
    </div>
  );
};

export default StudentClassroomPortal;
     