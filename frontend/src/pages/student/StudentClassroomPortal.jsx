import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeProvider';
import ClassroomList from '../../components/student/ClassroomList';
import ClassroomView from '../../components/student/ClassroomView';
import { getClassroomsByStudent, getClassroomById } from '../../app/features/classroom/classroomThunks';
import { getAttendanceWindowStatus, markAttendanceByFaceAndLocation, getStudentAttendance } from '../../app/features/attendance/attendanceThunks';

const StudentClassroomPortal = () => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  const dispatch = useDispatch();
  
  // Get student ID from auth state
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id;
  
  // Access the Redux state using useSelector
  const { 
    studentClassrooms: classrooms, 
    currentClassroom: selectedClassroomData,
    isLoading: classroomsLoading 
  } = useSelector((state) => state.classrooms);

  const {
    attendanceWindow,
    currentAttendanceStatus,
    studentAttendance,
    isLoading: attendanceLoading
  } = useSelector((state) => state.attendance);
  
  // State for selected classroom
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  
  // Fetch classrooms when component mounts
  useEffect(() => {
    if (studentId) {
      dispatch(getClassroomsByStudent(studentId));
    }
  }, [dispatch, studentId]);
  
  // When user selects a classroom, fetch the detailed data
  useEffect(() => {
    if (selectedClassroom) {
      dispatch(getClassroomById(selectedClassroom._id));
      
      // Also fetch attendance data for this classroom
      // dispatch(getAttendanceWindowStatus(selectedClassroom._id));
      
      // Get student attendance history for this course
      if (selectedClassroom.course?._id) {
        dispatch(getStudentAttendance(selectedClassroom.course._id));
      }
    }
  }, [dispatch, selectedClassroom]);
  
  // Handle classroom selection
  const handleClassroomSelection = (classroom) => {
    setSelectedClassroom(classroom);
  };
  
  // Handle going back to classroom list
  const handleBackToClassrooms = () => {
    setSelectedClassroom(null);
  };
  
  // Function to mark attendance using facial recognition and location
  const handleMarkAttendance = async (faceEmbeddingData, location) => {
    if (selectedClassroom && attendanceWindow.isOpen) {
      await dispatch(markAttendanceByFaceAndLocation({
        classId: selectedClassroom._id,
        faceEmbeddingData,
        location
      }));
      
      // Refresh attendance window status after marking attendance
      dispatch(getAttendanceWindowStatus(selectedClassroom._id));
    }
  };
  
  const isLoading = classroomsLoading || attendanceLoading;
  
  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.gradientBackground} flex items-center justify-center`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
          <h3 className={`text-xl font-medium ${currentTheme.gradient.text}`}>Loading your classrooms...</h3>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${currentTheme.gradientBackground}`}>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className={`mb-8 ${isDark ? 'opacity-90' : 'opacity-100'}`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? currentTheme.gradient.text : currentTheme.gradient.text}`}>
            {selectedClassroom ? 'Classroom Details' : 'My Classrooms'}
          </h1>
          <p className={`${currentTheme.secondaryText}`}>
            {selectedClassroom 
              ? `View details and manage attendance for ${selectedClassroom.name}`
              : 'Select a classroom to view details and manage attendance'}
          </p>
        </div>
        
        {selectedClassroom ? (
          <div className={`${currentTheme.card} p-6 rounded-xl transition-all duration-300`}>
            <button 
              onClick={handleBackToClassrooms}
              className={`mb-6 px-4 py-2 flex items-center gap-2 ${isDark 
                ? 'bg-[#121A22]/80 hover:bg-[#121A22] text-white border border-[#1E2733] rounded-lg transition-all' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Classrooms
            </button>
            
            <ClassroomView 
              selectedClassroom={selectedClassroomData || selectedClassroom}
              onBack={handleBackToClassrooms}
              attendanceWindow={attendanceWindow}
              currentAttendanceStatus={currentAttendanceStatus}
              studentAttendance={studentAttendance}
              onMarkAttendance={handleMarkAttendance}
              currentTheme={currentTheme}
              isDark={isDark}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Stats Overview Card */}
            <div className={`${currentTheme.card} p-6 rounded-xl mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDark 
                  ? 'bg-gradient-to-br from-[#1A2520]/60 to-[#0A0E13]/40 border border-[#2F955A]/30' 
                  : 'bg-emerald-50 border border-emerald-100'}`}
                >
                  <p className={`text-sm ${currentTheme.secondaryText}`}>Total Classrooms</p>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-emerald-600'}`}>
                    {classrooms?.data?.length || 0}
                  </h3>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark 
                  ? 'bg-gradient-to-br from-[#251A1A]/60 to-[#0A0E13]/40 border border-[#F2683C]/30' 
                  : 'bg-amber-50 border border-amber-100'}`}
                >
                  <p className={`text-sm ${currentTheme.secondaryText}`}>Active Classes</p>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-amber-600'}`}>
                    {classrooms?.data?.filter(c => c.isActive)?.length || 0}
                  </h3>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark 
                  ? 'bg-gradient-to-br from-[#121A22]/60 to-[#0A0E13]/40 border border-[#506EE5]/30' 
                  : 'bg-blue-50 border border-blue-100'}`}
                >
                  <p className={`text-sm ${currentTheme.secondaryText}`}>Attendance Rate</p>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>
                    {studentAttendance?.attendanceRate || '0%'}
                  </h3>
                </div>
              </div>
            </div>
            
            <ClassroomList 
              classrooms={classrooms?.data || []}
              selectedClassroom={selectedClassroom}
              onSelectClassroom={handleClassroomSelection}
              currentTheme={currentTheme}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClassroomPortal;