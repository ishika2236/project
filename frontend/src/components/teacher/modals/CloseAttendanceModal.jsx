import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Clock, Calendar, Users, X, Check, AlertCircle, FileText, 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  openAttendanceWindow, 
  closeAttendanceWindow, 
  getClassAttendance,
  markAttendanceManually,
  getAttendanceWindowStatus,
  bulkMarkAttendance 
} from "../../../app/features/attendance/attendanceThunks";
export function CloseAttendanceModal({ isOpen, onClose, classId, courseName, groupName }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
  
    const handleCloseAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(closeAttendanceWindow(classId)).unwrap();
        onClose();
      } catch (err) {
        setError(err || "Failed to close attendance window");
      } finally {
        setLoading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-400 to-pink-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Close Attendance</h2>
              <button 
                onClick={onClose} 
                className="text-white hover:text-red-100"
              >
                <X size={24} />
              </button>
            </div>
            <p className="opacity-90 mt-1">{courseName} • {groupName}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle size={48} className="text-red-500" />
              </div>
              <p className="text-center text-gray-700">
                Are you sure you want to close the attendance window? 
                Students will no longer be able to mark their attendance for this session.
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseAttendance}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-lg flex items-center"
              >
                {loading ? "Closing..." : (
                  <>
                    <X size={16} className="mr-1" />
                    Close Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  