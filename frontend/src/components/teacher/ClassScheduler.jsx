import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  MapPin, 
  RefreshCw, 
  FileText 
} from 'lucide-react';
import ClassSchedulingModal from './modals/ClassSchedulingModal';
import LocationUpdateModal from './modals/LocationUpdateModal';
import ClassInfoUpdateModal from './modals/ClassInfoUpdateModal';
import { 
  getClassesForDateRange, 
  getClassesByClassroomForDateRange,
  scheduleClass, 
  rescheduleClass, 
  deleteClass,
  updateClassLocation,
  updateClassNotes,
  updateClassTopics,
  updateSpecialRequirements
} from '../../app/features/class/classThunks';
import { reset } from './../../app/features/class/classSlice';

const ClassScheduler = ({ isDark, currentTheme, classroom }) => {
  const dispatch = useDispatch();
  const { classes, isLoading, isSuccess, isError, message } = useSelector(state => state.classes);
  
  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch classes function
  const fetchClasses = useCallback(() => {
    if (!classroom?.id) return;
    
    const startDate = new Date().toISOString();
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString();
    
    dispatch(getClassesByClassroomForDateRange({ 
      startDate, 
      endDate, 
      classroomId: classroom.id 
    }));
  }, [dispatch, classroom?.id]);

  // Initial fetch
  useEffect(() => {
    fetchClasses();
    
    // Cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [fetchClasses, dispatch]);

  // Handle Redux state updates
  useEffect(() => {
    if (isSuccess && message) {
      setSuccessMessage(message);
      
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
        dispatch(reset());
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (isError && message) {
      setLocalError(message);
      
      // Clear error message after 3 seconds
      const timer = setTimeout(() => {
        setLocalError(null);
        dispatch(reset());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, message, dispatch]);

  // Modal handlers
  const handleOpenScheduleModal = (classItem = null) => {
    setSelectedClass(classItem);
    setIsScheduleModalOpen(true);
  };

  const handleOpenLocationModal = (classItem) => {
    setSelectedClass(classItem);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLocationModalOpen(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocalError("Failed to get your location. Please enable location services.");
          setIsLocationModalOpen(true);
        }
      );
    } else {
      setLocalError("Geolocation is not supported by your browser.");
      setIsLocationModalOpen(true);
    }
  };

  const handleOpenInfoModal = (classItem) => {
    setSelectedClass(classItem);
    setIsInfoModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsScheduleModalOpen(false);
    setIsLocationModalOpen(false);
    setIsInfoModalOpen(false);
    setSelectedClass(null);
  };

  // Action handlers with proper error handling and state updates
  const handleSaveSchedule = async (scheduleData) => {
    try {
      let result;
      
      if (selectedClass) {
        // Update existing class schedule
        result = await dispatch(rescheduleClass({ 
          id: selectedClass._id, 
          scheduleData: { 
            ...scheduleData,
            classroom: classroom.id 
          } 
        })).unwrap();
      } else {
        // Create new class
        result = await dispatch(scheduleClass({
          ...scheduleData,
          classroom: classroom.id
        })).unwrap();
      }
      
      // Close modal immediately after successful operation
      handleCloseModals();
      
      // The Redux state should update automatically through the slice
      // No need to manually fetch classes again as the slice handles the state update
      
    } catch (err) {
      console.error('Error scheduling class:', err);
      setLocalError(err || 'Failed to schedule class. Please try again.');
      
      // Clear error after 3 seconds
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  const handleUpdateLocation = async (locationData) => {
    try {
      if (!selectedClass) return;
      
      await dispatch(updateClassLocation({
        id: selectedClass._id,
        locationData
      })).unwrap();
      
      handleCloseModals();
      
    } catch (err) {
      console.error('Error updating location:', err);
      setLocalError(err || 'Failed to update location. Please try again.');
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  const handleUpdateClassInfo = async (classInfoData) => {
    try {
      if (!selectedClass) return;
      
      // Update different fields based on what's provided
      const updatePromises = [];
      
      if (classInfoData.notes !== undefined) {
        updatePromises.push(
          dispatch(updateClassNotes({
            id: selectedClass._id,
            notesData: { notes: classInfoData.notes }
          }))
        );
      }
      
      if (classInfoData.topics !== undefined) {
        updatePromises.push(
          dispatch(updateClassTopics({
            id: selectedClass._id,
            topicsData: { topics: classInfoData.topics }
          }))
        );
      }
      
      if (classInfoData.specialRequirements !== undefined) {
        updatePromises.push(
          dispatch(updateSpecialRequirements({
            id: selectedClass._id,
            requirementsData: { specialRequirements: classInfoData.specialRequirements }
          }))
        );
      }
      
      // For title and other general fields, use rescheduleClass
      const generalUpdates = {};
      if (classInfoData.title) generalUpdates.title = classInfoData.title;
      
      if (Object.keys(generalUpdates).length > 0) {
        updatePromises.push(
          dispatch(rescheduleClass({
            id: selectedClass._id,
            scheduleData: generalUpdates
          }))
        );
      }
      
      // Wait for all updates to complete
      await Promise.all(updatePromises.map(p => p.unwrap()));
      
      handleCloseModals();
      
    } catch (err) {
      console.error('Error updating class info:', err);
      setLocalError(err || 'Failed to update class information. Please try again.');
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    
    try {
      await dispatch(deleteClass(classId)).unwrap();
      // The Redux slice will handle removing the class from the state
    } catch (err) {
      console.error('Error deleting class:', err);
      setLocalError(err || 'Failed to delete class. Please try again.');
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    try {
      if (!timeString) return '';
      
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString;
    }
  };

  // Format day names
  const formatDays = (daysArray) => {
    if (!daysArray || !Array.isArray(daysArray) || daysArray.length === 0) return 'No days set';
    
    return daysArray.map(day => {
      if (typeof day === 'number') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day];
      }
      return day;
    }).join(', ');
  };

  // Location display helper
  const getLocationDisplay = (classItem) => {
    if (!classItem.location) return "No location set";
    
    if (classItem.location.room && classItem.location.building) {
      return `${classItem.location.room} ${classItem.location.building}`;
    } 
    else if (classItem.location.room) {
      return classItem.location.room;
    } else if (classItem.location.latitude && classItem.location.longitude) {
      return `Lat: ${classItem.location.latitude.toFixed(4)}, Long: ${classItem.location.longitude.toFixed(4)}`;
    } else {
      return "Location set";
    }
  };

  // Ensure classes is always an array
  const safeClasses = Array.isArray(classes) ? classes : [];
  
  // Group classes by regular vs extra
  const regularClasses = safeClasses.filter(c => !c.isExtraClass);
  const extraClasses = safeClasses.filter(c => c.isExtraClass);

  return (
    <div className="space-y-6">
      {/* Header with Add Class button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Class Schedule
        </h2>
        <button
          onClick={() => handleOpenScheduleModal()}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? currentTheme.button.primary
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus size={16} />
          <span>Schedule Class</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${
          isDark ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800'
        }`}>
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      
      {localError && (
        <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${
          isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-800'
        }`}>
          <AlertCircle size={18} />
          <span>{localError}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`flex justify-center items-center h-40 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-400 mb-4"></div>
            <p>Loading classes...</p>
          </div>
        </div>
      )}

      {/* No Classes State */}
      {!isLoading && safeClasses.length === 0 && (
        <div className={`flex flex-col items-center justify-center p-8 rounded-lg ${
          isDark ? 'bg-[#121A22]/50 border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
        }`}>
          <Calendar size={48} className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            No Classes Scheduled
          </h3>
          <p className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            You haven't scheduled any classes for this classroom yet.
          </p>
          <button
            onClick={() => handleOpenScheduleModal()}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-[#1E2733] text-white hover:bg-[#283647]'
                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={16} />
            <span>Schedule Your First Class</span>
          </button>
        </div>
      )}

      {/* Regular Classes List */}
      {!isLoading && regularClasses.length > 0 && (
        <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#121A22]/50 border border-[#1E2733]' : 'bg-white border border-gray-200'}`}>
          <div className={`p-4 ${isDark ? 'bg-[#1E2733]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Regular Classes ({regularClasses.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-[#1E2733]">
            {regularClasses.map(classItem => (
              <div key={`regular-${classItem._id}`} className={`p-4 transition-colors ${isDark ? 'hover:bg-[#1E2733]/50' : 'hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="w-3/4">
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {classItem.title || 'Untitled Class'}
                    </h4>
                    <div className={`flex items-center gap-3 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDays(classItem.schedule?.daysOfWeek)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(classItem.schedule?.startTime)} - {formatTime(classItem.schedule?.endTime)}
                      </span>
                    </div>
                    {classItem.schedule?.startDate && classItem.schedule?.endDate && (
                      <div className={`text-sm mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(classItem.schedule.startDate)} to {formatDate(classItem.schedule.endDate)}
                      </div>
                    )}
                    <div className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={14} />
                      {getLocationDisplay(classItem)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenScheduleModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-blue-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Reschedule Class"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenLocationModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-green-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-green-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Update Location"
                      >
                        <MapPin size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenInfoModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-yellow-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Update Class Info"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem._id)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-red-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete Class"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra Classes List */}
      {!isLoading && extraClasses.length > 0 && (
        <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#121A22]/50 border border-[#1E2733]' : 'bg-white border border-gray-200'}`}>
          <div className={`p-4 ${isDark ? 'bg-[#1E2733]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Extra Classes ({extraClasses.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-[#1E2733]">
            {extraClasses.map(classItem => (
              <div key={`extra-${classItem._id}`} className={`p-4 transition-colors ${isDark ? 'hover:bg-[#1E2733]/50' : 'hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="w-3/4">
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {classItem.title || 'Untitled Extra Class'}
                    </h4>
                    <div className={`flex items-center gap-3 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {classItem.extraClassDate && formatDate(classItem.extraClassDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(classItem.schedule?.startTime)} - {formatTime(classItem.schedule?.endTime)}
                      </span>
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={14} />
                      {getLocationDisplay(classItem)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenScheduleModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-blue-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Reschedule Class"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenLocationModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-green-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-green-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Update Location"
                      >
                        <MapPin size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenInfoModal(classItem)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-yellow-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Update Class Info"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem._id)}
                        disabled={isLoading}
                        className={`p-2 rounded-full flex items-center transition-colors ${
                          isDark 
                            ? 'bg-[#1E2733] text-red-400 hover:bg-[#283647]'
                            : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete Class"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {isScheduleModalOpen && (
        <ClassSchedulingModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseModals}
          onSave={handleSaveSchedule}
          classroom={classroom}
          classToEdit={selectedClass}
          isDark={isDark}
          currentTheme={currentTheme}
        />
      )}

      {isLocationModalOpen && (
        <LocationUpdateModal 
          isOpen={isLocationModalOpen}
          onClose={handleCloseModals}
          onSave={handleUpdateLocation}
          currentLocation={selectedClass?.location}
          userLocation={userLocation}
          isDark={isDark}
          currentTheme={currentTheme}
        />
      )}

      {isInfoModalOpen && (
        <ClassInfoUpdateModal
          isOpen={isInfoModalOpen}
          onClose={handleCloseModals}
          onSave={handleUpdateClassInfo}
          classToEdit={selectedClass}
          isDark={isDark}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
};

export default ClassScheduler;