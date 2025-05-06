
import React, { useState, useEffect } from 'react';
import AttendanceFaceRecognition from './AttendanceFaceRecognition';
import { Clock, MapPin } from 'lucide-react';
const AttendanceModal = ({ 
    isOpen, 
    onClose, 
    classItem, 
    onSuccessfulAttendance,
    isDark 
  }) => {
    const [attendanceState, setAttendanceState] = useState('initial'); // initial, verifying, success, error
    const [errorMessage, setErrorMessage] = useState('');
  
    // Handle successful face recognition and location verification
    const handleSuccessfulVerification = async () => {
      try {
        // In a real implementation, you would pass the actual student ID
        const studentId = '123'; // This would come from your authentication context
        const result = await markStudentAttendance(studentId, classItem?.id, null, null);
        
        if (result.success) {
          setAttendanceState('success');
          
          // Notify parent component about successful attendance
          if (onSuccessfulAttendance) {
            setTimeout(() => {
              onSuccessfulAttendance(classItem?.id);
            }, 1000);
          }
        } else {
          throw new Error(result.message || 'Failed to mark attendance');
        }
      } catch (error) {
        setErrorMessage(error.message);
        setAttendanceState('error');
      }
    };
  
    // Handle error during verification
    const handleVerificationError = (message) => {
      setErrorMessage(message);
      setAttendanceState('error');
    };
  
    // Reset the modal state
    const resetModal = () => {
      setAttendanceState('initial');
      setErrorMessage('');
    };
  
    // Close the modal
    const handleClose = () => {
      resetModal();
      if (onClose) {
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-md overflow-hidden`}>
          {/* Modal header */}
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Mark Attendance
            </h3>
            {classItem && (
              <div className={`flex items-center mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock className="h-4 w-4 mr-1" />
                <span>{classItem.date}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{classItem.room}</span>
              </div>
            )}
          </div>
  
          {/* Modal content */}
          <div className="p-4">
            {attendanceState === 'success' ? (
              <div className="text-center py-6">
                <div className={`w-16 h-16 ${isDark ? 'bg-green-900/30' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <CheckCircle className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h4 className={`text-xl font-medium ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                  Attendance Marked Successfully!
                </h4>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  Your attendance has been recorded for {classItem?.title}
                </p>
                <button
                  onClick={handleClose}
                  className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-lg text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}
                >
                  Close
                </button>
              </div>
            ) : (
              <AttendanceFaceRecognition
                classItem={classItem}
                onSuccessfulAttendance={handleSuccessfulVerification}
                onError={handleVerificationError}
                onCancel={handleClose}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    );
  };
export default  AttendanceModal;