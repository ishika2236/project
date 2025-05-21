import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, UserCheck } from "lucide-react";
import { openAttendanceWindow } from "../../../app/features/attendance/attendanceThunks";
export function OpenAttendanceModal({ isOpen, onClose, classId, courseName, groupName }) {
    const [duration, setDuration] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
  
    const handleOpenAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(openAttendanceWindow({ classId, duration })).unwrap();
        onClose();
      } catch (err) {
        setError(err || "Failed to open attendance window");
      } finally {
        setLoading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Open Attendance</h2>
              <button 
                onClick={onClose} 
                className="text-white hover:text-emerald-100"
              >
                <X size={24} />
              </button>
            </div>
            <p className="opacity-90 mt-1">{courseName} • {groupName}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Set Attendance Duration (minutes)
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="px-3 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                />
                <button 
                  onClick={() => setDuration(duration + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
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
                onClick={handleOpenAttendance}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg flex items-center"
              >
                {loading ? "Opening..." : (
                  <>
                    <Clock size={16} className="mr-1" />
                    Open Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  