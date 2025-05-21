import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, FileText, BookOpen, CheckCircle, AlertCircle, CheckCheck, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import ClassesSection from './ClassesSection';
import { getClassesByClassroom } from '../../app/features/class/classThunks';
import { reset } from '../../app/features/classroom/classroomSlice';
import IntegratedAttendanceComponent from './IntegratedAttendanceComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  verifyFaceEmbedding,
  checkLocationValidityAndMarkPresent,
} from '../../app/features/attendance/attendanceThunks';

// Main ClassroomView Component
const ClassroomView = ({ selectedClassroom }) => {
  const { isDark } = useTheme(); // Get isDark from theme context
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const classroomId = selectedClassroom?._id;

  // Redux state
  const dispatch = useDispatch();
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Fetch classes when component mounts or classroomId changes
  useEffect(() => {
    if (classroomId) {
      dispatch(getClassesByClassroom(classroomId));
    }
    
    // Cleanup function
    return () => {
      dispatch(reset());
    };
  }, [dispatch, classroomId]);

  // Helper function to format time string from HH:MM format
  const formatTimeString = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes} ${period}`;
  };

  // Helper function to check if a specific day of week is included in daysOfWeek array
  const isDayInSchedule = (daysOfWeek, dayToCheck) => {
    return daysOfWeek && daysOfWeek.includes(dayToCheck);
  };

  // Update the isScheduledForToday function to handle extra classes
  const isScheduledForToday = (classItem) => {
    const today = new Date();
    
    // First check if it's an extra class with a specific date
    if (classItem.isExtraClass && classItem.extraClassDate) {
      const extraDate = new Date(classItem.extraClassDate);
      return today.toDateString() === extraDate.toDateString();
    }
    
    // Regular class with schedule
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return isDayInSchedule(classItem.schedule?.daysOfWeek, dayOfWeek);
  };

  // Helper function to determine if a class is scheduled for tomorrow
  const isScheduledForTomorrow = (classItem) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = tomorrow.getDay();
    
    return isDayInSchedule(classItem.schedule?.daysOfWeek, tomorrowDayOfWeek);
  };

  // Helper function to check if a date falls within a date range
  const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkDate >= start && checkDate <= end;
  };

  // Helper function to determine class status based on current date and time
  const getClassStatus = (classItem) => {
    if (!classItem.schedule && !classItem.extraClassDate) return 'unknown';
    
    const now = new Date();
    const today = new Date();
    
    // Handle extra class with specific date
    if (classItem.isExtraClass && classItem.extraClassDate) {
      const extraDate = new Date(classItem.extraClassDate);
      
      // If dates don't match, it's either upcoming or past
      if (today.toDateString() !== extraDate.toDateString()) {
        return today < extraDate ? 'upcoming' : 'past';
      }
      
      // Extra class is today, compare with time
      const startTimeStr = classItem.schedule?.startTime || "00:00";
      const endTimeStr = classItem.schedule?.endTime || "00:00";
      
      const [startHour, startMinute] = startTimeStr.split(':').map(Number);
      const [endHour, endMinute] = endTimeStr.split(':').map(Number);
      
      const todayWithStartTime = new Date(today);
      todayWithStartTime.setHours(startHour, startMinute, 0);
      
      const todayWithEndTime = new Date(today);
      todayWithEndTime.setHours(endHour, endMinute, 0);
      
      // Determine status based on current time
      if (now >= todayWithStartTime && now <= todayWithEndTime) {
        return 'ongoing';
      } else if (now < todayWithStartTime) {
        return 'upcoming-today';
      } else {
        return 'past';
      }
    }
    
    // Regular class handling (existing code)
    const startDate = new Date(classItem.schedule?.startDate);
    const endDate = new Date(classItem.schedule?.endDate);
    
    // Check if today is within the overall date range of the class
    if (!isDateInRange(today, startDate, endDate)) {
      // If today is before start date, class is upcoming
      if (today < startDate) return 'upcoming';
      // If today is after end date, class is past
      if (today > endDate) return 'past';
    }
    
    // Check if class is scheduled for today based on daysOfWeek
    if (!isScheduledForToday(classItem)) {
      // If not scheduled for today, it's either upcoming or we'll handle it separately
      return 'not-today';
    }
    
    // Parse start and end times for today
    const startTimeStr = classItem.schedule?.startTime || "00:00";
    const endTimeStr = classItem.schedule?.endTime || "00:00";
    
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
    
    const todayWithStartTime = new Date(today);
    todayWithStartTime.setHours(startHour, startMinute, 0);
    
    const todayWithEndTime = new Date(today);
    todayWithEndTime.setHours(endHour, endMinute, 0);
    
    // Determine the status based on current time
    if (now >= todayWithStartTime && now <= todayWithEndTime) {
      return 'ongoing';
    } else if (now < todayWithStartTime) {
      return 'upcoming-today';
    } else {
      return 'past';
    }
  };
  
  // Update the processClasses function to handle extra classes
  const processClasses = (classItems) => {
    if (!classItems || !Array.isArray(classItems) || classItems.length === 0) {
      return [];
    }
    
    return classItems.flatMap(classItem => {
      const results = [];
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Handle extra classes specially
      if (classItem.isExtraClass && classItem.extraClassDate) {
        const extraDate = new Date(classItem.extraClassDate);
        
        // Get the status based on date and time
        let status;
        if (today.toDateString() === extraDate.toDateString()) {
          // Extra class is today, determine status by time
          const startTimeStr = classItem.schedule?.startTime || "00:00";
          const endTimeStr = classItem.schedule?.endTime || "00:00";
          const [startHour, startMinute] = startTimeStr.split(':').map(Number);
          const [endHour, endMinute] = endTimeStr.split(':').map(Number);
          
          const todayWithStartTime = new Date(today);
          todayWithStartTime.setHours(startHour, startMinute, 0);
          
          const todayWithEndTime = new Date(today);
          todayWithEndTime.setHours(endHour, endMinute, 0);
          
          const now = new Date();
          
          if (now >= todayWithStartTime && now <= todayWithEndTime) {
            status = 'ongoing';
          } else if (now < todayWithStartTime) {
            status = 'upcoming';
          } else {
            status = 'past';
          }
        } else {
          // Extra class is on a different date
          status = today < extraDate ? 'upcoming' : 'past';
        }
        
        results.push(createClassObject(classItem, extraDate, status));
        return results;
      }
      
      // Original logic for regular classes
      const startDate = new Date(classItem.schedule?.startDate);
      const endDate = new Date(classItem.schedule?.endDate);
      
      // Basic class status
      const basicStatus = getClassStatus(classItem);
      
      // If class is scheduled for today
      if (isScheduledForToday(classItem) && isDateInRange(today, startDate, endDate)) {
        const startTimeStr = classItem.schedule?.startTime || "00:00";
        const endTimeStr = classItem.schedule?.endTime || "00:00";
        const [startHour, startMinute] = startTimeStr.split(':').map(Number);
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);
        
        const todayWithStartTime = new Date(today);
        todayWithStartTime.setHours(startHour, startMinute, 0);
        
        const todayWithEndTime = new Date(today);
        todayWithEndTime.setHours(endHour, endMinute, 0);
        
        const now = new Date();
        let status;
        
        if (now >= todayWithStartTime && now <= todayWithEndTime) {
          status = 'ongoing';
        } else if (now < todayWithStartTime) {
          status = 'upcoming';
        } else {
          status = 'past';
        }
        
        results.push(createClassObject(classItem, today, status));
      }
  
      
      // If class is scheduled for tomorrow
      if (isScheduledForTomorrow(classItem) && isDateInRange(tomorrow, startDate, endDate)) {
        results.push(createClassObject(classItem, tomorrow, 'upcoming'));
      }
      
      // For other future days
      const daysToCheck = 7; // Check up to a week ahead
      for (let i = 2; i < daysToCheck; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + i);
        
        if (isDateInRange(futureDate, startDate, endDate) && 
            isDayInSchedule(classItem.schedule?.daysOfWeek, futureDate.getDay())) {
          results.push(createClassObject(classItem, futureDate, 'upcoming'));
          break; // Just include the next occurrence after tomorrow
        }
      }
      
      // If no results were added (no upcoming occurrences), add a placeholder entry with basic status
      if (results.length === 0) {
        let defaultDate;
        if (basicStatus === 'past') {
          defaultDate = endDate;
        } else {
          defaultDate = startDate;
        }
        results.push(createClassObject(classItem, defaultDate, basicStatus));
      }
      
      return results;
    });
  };

  // Helper function to create a class object
  const createClassObject = (classItem, date, status) => {
    const startTimeStr = classItem.schedule?.startTime || "00:00";
    const endTimeStr = classItem.schedule?.endTime || "00:00";
    const timeStr = `${formatTimeString(startTimeStr)} - ${formatTimeString(endTimeStr)}`;
    
    // Format date string
    const today = new Date();
    let dateStr;
    
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString() === date.toDateString()) {
      dateStr = 'Tomorrow';
    } else if (new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString()) {
      dateStr = 'Yesterday';
    } else {
      dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    // Get location details - handle both nested and flat structure
    const room = classItem.location?.room || 
                (classItem.originalData && classItem.originalData.location?.room) || 
                "Room not specified";
    
    // Check if user has attended
    const hasAttended = classItem.attendanceRecords?.some(record => 
      record.studentId === currentUserId
    ) || false;
    
    // Create a consistent ID
    const itemId = classItem._id || 
                  (classItem.originalData && classItem.originalData._id) || 
                  classItem.id ||
                  `generated-${Date.now()}`;
    
    return {
      _id: itemId,
      id: `${itemId}-${date.toISOString()}`,
      title: classItem.title || 
            (classItem.course?.courseName) || 
            (classItem.originalData && classItem.originalData.title) ||
            selectedClassroom?.course?.name || 
            "Untitled Class",
      date: dateStr,
      time: timeStr,
      room: room,
      status: status,
      attended: hasAttended,
      originalData: classItem,
      isExtraClass: classItem.isExtraClass || 
                    (classItem.originalData && classItem.originalData.isExtraClass) || 
                    false,
      daysOfWeek: classItem.schedule?.daysOfWeek || [],
      extraClassDate: classItem.extraClassDate || 
                      (classItem.originalData && classItem.originalData.extraClassDate) || 
                      null
    };
  };
  
  // Mock current user ID (replace with actual user ID from auth context)
  const currentUserId = user._id;

  // Handle face verification with toast notifications
  const handleVerifyFace = async (embeddingData) => {
    try {
      // Show toast for face verification process
      const verifyingToastId = toast.info(
        <div className="flex flex-col items-center">
          <div className="mb-2 animate-pulse">
            <CheckCircle className="text-blue-500" size={28} />
          </div>
          <div className="font-medium">Verifying Face...</div>
        </div>,
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
          className: "attendance-verification-toast"
        }
      );

      // Call the actual verification
      const result = await dispatch(verifyFaceEmbedding(embeddingData)).unwrap();
      
      // Dismiss the verifying toast
      toast.dismiss(verifyingToastId);
      
      // Show success or error toast based on result
      if (result.success) {
        toast.success(
          <div className="flex flex-col items-center">
            <CheckCheck className="mb-2" size={28} />
            <div className="font-medium">Face Verified!</div>
            <div className="text-sm">Checking location...</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "attendance-success-toast"
          }
        );
      } else {
        toast.error(
          <div className="flex flex-col items-center">
            <AlertCircle className="mb-2" size={28} />
            <div className="font-medium">Face Verification Failed</div>
            <div className="text-sm">Please try again</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "attendance-error-toast"
          }
        );
      }
      
      return { success: result.success };
    } catch (error) {
      console.error("Face verification failed:", error);
      
      // Show error toast

      toast.error(
        <div className="flex flex-col items-center">
          <AlertCircle className="mb-2" size={28} />
          <div className="font-medium">Face Verification Failed</div>
          <div className="text-sm">{error  || error?.message || "An unexpected error occurred"}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "attendance-error-toast"
        }
      );
      
      return { success: false };
    }
  };
  
  // Function to check location and mark attendance with toast notifications
  const handleLocationAndAttendance = async ({ classId, location }) => {
    try {
      // Show toast for location verification process
      const locationToastId = toast.info(
        <div className="flex flex-col items-center">
          <div className="mb-2 animate-pulse">
            <MapPin className="text-green-500" size={28} />
          </div>
          <div className="font-medium">Checking Location...</div>
        </div>,
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
          className: "location-verification-toast"
        }
      );

      // Call the actual location verification & attendance marking
      const result = await dispatch(
        checkLocationValidityAndMarkPresent({ classId, location })
      ).unwrap();
      
      // Dismiss the location checking toast
      toast.dismiss(locationToastId);
      
      // Show success or error toast based on result
      if (result.success){
        handleAttendanceSuccess(selectedClass?.title || "Class");
      } else {
        toast.error(
          <div className="flex flex-col items-center">
            <AlertCircle className="mb-2" size={28} />
            <div className="font-medium">Location Verification Failed</div>
            <div className="text-sm">You must be in the classroom to mark attendance</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "attendance-error-toast"
          }
        );
      }
      
      return { isValid: result.isValid };
    } catch (error) {
      console.error("Location verification failed:", error);
      
      // Show error toast
      toast.error(
        <div className="flex flex-col items-center">
          <AlertCircle className="mb-2" size={28} />
          <div className="font-medium">Location Verification Failed</div>
          <div className="text-sm">{error || error?.message || "An unexpected error occurred"}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "attendance-error-toast"
        }
      );
      
      return { isValid: false };
    }
  };
  

  // Handler for successful attendance marking
  const handleAttendanceSuccess = (classTitle) => {
    // Show toast notification to confirm attendance was marked
    toast.success(
      <div className="flex flex-col items-center">
        <CheckCircle className="mb-2" size={28} />
        <div className="font-medium">Attendance Marked!</div>
        <div className="text-sm">{classTitle || 'Class'}</div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "attendance-success-toast"
      }
    );
    
    // Close the attendance modal
    setShowAttendanceModal(false);
    
    // Refresh class data if needed
    if (classroomId) {
      dispatch(getClassesByClassroom(classroomId));
    }
  };

  // Open attendance modal
  const openAttendanceModal = (classItem) => {
    // Ensure we have proper structure in the class item
    // IntegratedAttendanceComponent expects to access classItem._id
    // but ClassroomView may provide classItem.originalData._id
    
    console.log("Opening attendance modal for class:", classItem);
    
    // Set the class item with proper structure
    setSelectedClass({
      // Ensure _id is available at the top level
      _id: classItem._id || (classItem.originalData && classItem.originalData._id) || classItem.id,
      // Keep the full original data
      ...classItem
    });
    
    // Then show the modal
    setShowAttendanceModal(true);
  };
  
  // Mock class data for demonstration - using your provided schedule format
  const mockClasses = [
    {
      _id: 'class1',
      title: 'Introduction to Programming',
      schedule: {
        startDate: '2025-05-07T00:00:00.000+00:00',
        endDate: '2025-05-30T00:00:00.000+00:00',
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        startTime: '10:00',
        endTime: '11:30',
        isExtraClass: false
      },
      location: { room: 'Room 101' },
      attendanceRecords: []
    },
    {
      _id: 'class2',
      title: 'Web Development',
      schedule: {
        startDate: '2025-05-16T00:00:00.000+00:00',
        endDate: '2025-05-18T00:00:00.000+00:00',
        daysOfWeek: [6], // Saturday only
        startTime: '09:00',
        endTime: '10:30',
        isExtraClass: false
      },
      location: { room: 'Room 202' },
      attendanceRecords: []
    },
    {
      _id: 'class3',
      title: 'Database Systems',
      schedule: {
        startDate: '2025-05-16T00:00:00.000+00:00',
        endDate: '2025-05-30T00:00:00.000+00:00',
        daysOfWeek: [2, 4], // Tuesday, Thursday
        startTime: '14:00',
        endTime: '15:30',
        isExtraClass: false
      },
      location: { room: 'Room 303' },
      attendanceRecords: []
    },
    {
      _id: 'class4',
      title: 'Machine Learning',
      schedule: {
        startDate: '2025-05-17T00:00:00.000+00:00',
        endDate: '2025-05-17T00:00:00.000+00:00',
        daysOfWeek: [6], // Saturday
        startTime: '10:00',
        endTime: '12:00',
        isExtraClass: true
      },
      location: { room: 'Lab 404' },
      attendanceRecords: []
    }
  ];

  // Use real classes or mock classes
  const processedClasses = isLoading || isError ? [] : 
                          (classes.length > 0 ? processClasses(classes) : processClasses(mockClasses));

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Toast Container - added with higher z-index */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // High z-index to ensure visibility
      />

      {/* Header */}
      <div className={`sticky top-0 z-10 p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                {selectedClassroom?.course?.name || "Programming Course"}
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedClassroom?.department?.name || "Computer Science"} • {selectedClassroom?.assignedTeacher?.firstName || "John"} {selectedClassroom?.assignedTeacher?.lastName || "Doe"}
              </p>
            </div>
            <button 
              className={`px-3 py-1 rounded-lg text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Back
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 px-1 ${activeTab === 'schedule' 
                ? (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') 
                : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Schedule</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 px-1 ${activeTab === 'notes' 
                ? (isDark ? 'text-purple-400 border-b-2 border-purple-400' : 'text-purple-600 border-b-2 border-purple-600') 
                : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                <span>Notes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 px-1 ${activeTab === 'assignments' 
                ? (isDark ? 'text-amber-400 border-b-2 border-amber-400' : 'text-amber-600 border-b-2 border-amber-600') 
                : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
            >
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>Assignments</span>
              </div>
            </button>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="container mx-auto py-6 px-4">
        {isLoading ? (
          <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <p>Loading classes...</p>
          </div>
        ) : isError ? (
          <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p>Error loading classes: {message}</p>
          </div>
        ) : activeTab === 'schedule' ? (
          <div className="space-y-6">
            {/* Next 24 Hours Classes */}
            <div className={`p-4 mb-6 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Classes in the Next 24 Hours
              </h2>
              <div className="space-y-2">
                {processedClasses.filter(c => 
                  (c.status === 'ongoing' || c.status === 'upcoming') && 
                  (c.date === 'Today' || c.date === 'Tomorrow')
                ).length > 0 ? (
                  processedClasses.filter(c => 
                    (c.status === 'ongoing' || c.status === 'upcoming') && 
                    (c.date === 'Today' || c.date === 'Tomorrow')
                  ).map(classItem => (
                    <div key={classItem.id} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{classItem.title}</h3>
                          <div className="flex items-center mt-1 text-sm">
                            <Clock className={`w-4 h-4 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                            <span>{classItem.time}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm">
                            <Calendar className={`w-4 h-4 mr-1 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                            <span>{classItem.date}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm">
                            <div className={`w-2 h-2 rounded-full mr-1 ${classItem.originalData.schedule?.isExtraClass ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
                            <span>{classItem.originalData.schedule?.isExtraClass ? 'Extra class' : 'Regular schedule'}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          classItem.status === 'ongoing' 
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') 
                            : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                        }`}>
                          {classItem.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {classItem.room}
                          </span>
                        </div>
                        {classItem.status === 'ongoing' && (
                          <button 
                            onClick={() => openAttendanceModal(classItem)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            Mark Attendance
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`p-8 text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                    <Clock className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className="font-medium">No classes scheduled in the next 24 hours</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ongoing Classes */}
            <ClassesSection 
              title="Ongoing Classes"
              classes={processedClasses.filter(c => c.status === 'ongoing')}
              emptyMessage="No ongoing classes at the moment."
              icon={<Clock className="w-6 h-6" />}
              type="ongoing"
              openAttendanceModal={openAttendanceModal}
              isDark={isDark}
            />
            
            {/* Past Classes */}
            <ClassesSection 
              title="Past Classes"
              classes={processedClasses.filter(c => c.status === 'past')}
              emptyMessage="No past classes."
              icon={<CheckCircle className="w-6 h-6" />}
              type="past"
              isDark={isDark}
            />
          </div>
        ) : activeTab === 'notes' ? (
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h2 className="text-lg font-semibold mb-4">Course Notes</h2>
            <div className={`p-8 text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <FileText className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className="font-medium">No notes available for this course yet</p>
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h2 className="text-lg font-semibold mb-4">Assignments</h2>
            <div className={`p-8 text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className="font-medium">No assignments available for this course yet</p>
            </div>
          </div>
        )}
      </div>
      {showAttendanceModal && 
      <IntegratedAttendanceComponent
      isOpen={showAttendanceModal}
      onClose={() => setShowAttendanceModal(false)}
      classItem={selectedClass}
      verifyFace={handleVerifyFace}
      checkLocationAndMarkPresent={handleLocationAndAttendance}
      isDark={isDark} // Use the actual theme context instead of hardcoded value
    />
      }
    </div>
  );
};

export default ClassroomView;
