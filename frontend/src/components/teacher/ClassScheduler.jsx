import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import ClassroomScheduleModal from "./ClassroomScheduleModal";
import { 
  fetchClassById, 
  addClassSchedule, 
  updateClassSchedule, 
  deleteClassSchedule 
} from "../../app/features/class/classThunks";

export default function ClassScheduler({ isDark, currentTheme, classroom }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedClass, setSelectedClass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Get data from Redux store
  const { currentClass, loading, error, success } = useSelector(state => state.classes);
  
  // Extract schedules from the classroom or currentClass
  const [schedules, setSchedules] = useState([]);
  
  // Load class details when component mounts or classroom changes
  useEffect(() => {
    if (classroom?.id || classroom?._id) {
      const classId = classroom.id || classroom._id;
      dispatch(fetchClassById(classId));
    }
  }, [dispatch, classroom]);
  
  // Update local schedules when currentClass changes
  useEffect(() => {
    if (currentClass?.schedule) {
      setSchedules(currentClass.schedule);
    } else if (classroom?.courseDetails?.schedule) {
      setSchedules(classroom.courseDetails.schedule);
    } else {
      // Fallback to hardcoded data for demonstration
      setSchedules([
        { 
          _id: "temp1", 
          date: "May 6, 2025", 
          time: "10:30 AM - 12:00 PM", 
          topic: "Binary Trees & Traversal",
          location: "Room 302",
          description: "Introduction to binary trees and various traversal algorithms.",
          materials: ["Laptop", "Algorithm notebook"]
        },
        { 
          _id: "temp2", 
          date: "May 13, 2025", 
          time: "10:30 AM - 12:00 PM", 
          topic: "Graph Algorithms",
          location: "Room 302",
          description: "Overview of graph data structures and algorithms.",
          materials: ["Laptop", "Algorithm notebook"]
        }
      ]);
    }
  }, [currentClass, classroom]);
  
  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Handle opening the modal for creating a new class
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing class
  const openEditModal = (scheduleData) => {
    setModalMode('edit');
    setSelectedClass(scheduleData);
    setIsModalOpen(true);
  };

  // Handle saving a new or edited class
  const handleSaveClass = async (formData) => {
    // Clear any previous error
    setErrorMsg('');
    
    try {
      // Get the class ID from the classroom object
      const classId = classroom?.id || classroom?._id || classroom?.courseDetails?._id;
      
      if (!classId) {
        throw new Error("Could not determine classroom ID");
      }
      
      // Format the data properly for the API
      const scheduleData = {
        topic: formData.topic,
        date: formData.date,
        time: `${formData.startTime} - ${formData.endTime}`,
        location: formData.location,
        description: formData.description,
        materials: formData.materials
      };
      
      if (modalMode === 'create') {
        // Add a new class schedule
        await dispatch(addClassSchedule({
          classId,
          scheduleData
        })).unwrap();
      } else if (modalMode === 'edit' && selectedClass?._id) {
        // Update an existing schedule
        await dispatch(updateClassSchedule({
          classId,
          scheduleId: selectedClass._id,
          scheduleData
        })).unwrap();
      }
      
      // If successful, refresh class data
      dispatch(fetchClassById(classId));
      
      // Close the modal
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving schedule:", err);
      setErrorMsg(err.message || "Failed to save schedule. Please try again.");
    }
  };

  // Handle canceling/deleting a class
  const handleCancelClass = async (scheduleId) => {
    try {
      const classId = classroom?.id || classroom?._id || classroom?.courseDetails?._id;
      
      if (!classId) {
        throw new Error("Could not determine classroom ID");
      }
      
      await dispatch(deleteClassSchedule({
        classId,
        scheduleId
      })).unwrap();
      
      // If successful, refresh class data
      dispatch(fetchClassById(classId));
    } catch (err) {
      console.error("Error canceling schedule:", err);
      setErrorMsg(err.message || "Failed to cancel class. Please try again.");
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // Check if date is already in "Month Day, Year" format
    if (/^[A-Za-z]+ \d+, \d{4}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-[#0A0E13]' : 'bg-white bg-opacity-90 border border-purple-200 shadow-md'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-indigo-900'}`}>Class Schedule</h3>
        <button 
          onClick={openCreateModal}
          disabled={loading}
          className={`${
            isDark 
              ? 'bg-gradient-to-r from-[#506EE5]/60 to-[#1D2229] border border-[#1E4FFF]/30 text-white' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
          } px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Calendar size={16} className="mr-2" />
          Schedule Class
        </button>
      </div>
      
      {/* Display error message if any */}
      {errorMsg && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          isDark ? 'bg-[#251A1A] text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          <AlertCircle size={16} className="mr-2" />
          {errorMsg}
        </div>
      )}
      
      {/* Display loading state */}
      {loading && (
        <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="animate-pulse flex justify-center items-center">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-b-transparent animate-spin mr-2" 
                 style={{ borderColor: isDark ? '#506EE5' : '#6366F1', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}></div>
            <span>Loading schedule data...</span>
          </div>
        </div>
      )}
      
      {/* Display schedule list */}
      <div className="space-y-4">
        {!loading && schedules?.length > 0 ? (
          schedules.map((schedule) => (
            <div 
              key={schedule._id || schedule.id}
              className={`${
                isDark 
                  ? 'bg-[#121A22] border-[#1E2733]' 
                  : 'bg-white border-gray-200'
              } border rounded-lg p-4 flex justify-between items-center`}
            >
              <div>
                <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>
                  <Calendar size={14} className="mr-2" />
                  {formatDateForDisplay(schedule.date)}
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-2" />
                  {schedule.time}
                </div>
                <div className={isDark ? 'text-white' : 'text-indigo-900'}>{schedule.topic}</div>
                {schedule.location && (
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Location: {schedule.location}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(schedule)}
                  disabled={loading}
                  className={`px-3 py-1.5 ${
                    isDark 
                      ? 'bg-[#1E2733] text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  } rounded hover:opacity-80 transition-colors text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleCancelClass(schedule._id || schedule.id)}
                  disabled={loading}
                  className={`px-3 py-1.5 ${
                    isDark 
                      ? 'bg-[#251A1A] text-red-400' 
                      : 'bg-red-50 text-red-600'
                  } rounded hover:opacity-80 transition-colors text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className={`text-center py-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No upcoming classes scheduled. Click "Schedule Class" to add one.
          </div>
        )}
      </div>

      {/* Modal for creating/editing schedules */}
      <ClassroomScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        classData={selectedClass}
        onSave={handleSaveClass}
        classroom={classroom}
      />
    </div>
  );
}