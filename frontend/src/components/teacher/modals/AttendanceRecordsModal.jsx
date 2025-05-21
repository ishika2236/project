import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Clock, Calendar, Users, X, Check, AlertCircle, FileText, 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  closeAttendanceWindow,
  fetchAttendanceData,
  getClassAttendance 
} from "../../../app/features/attendance/attendanceThunks";

export function AttendanceRecordsModal({ isOpen, onClose, classId, courseName, groupName }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendanceData, setAttendanceData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateOptions, setDateOptions] = useState([]);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (isOpen && classId) {
        fetchAttendanceData();
        // Generate some date options for the last 30 days
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
        setDateOptions(dates);
      }
    }, [isOpen, classId, selectedDate]);
  
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, you'd pass the date as a parameter to get attendance for that specific date
        const result = await dispatch(getClassAttendance(classId)).unwrap();
        setAttendanceData(result.data);
      } catch (err) {
        setError(err || "Failed to fetch attendance records");
      } finally {
        setLoading(false);
      }
    };
  
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };
  
    const handlePreviousDate = () => {
      const prev = new Date(selectedDate);
      prev.setDate(selectedDate.getDate() - 1);
      setSelectedDate(prev);
    };
  
    const handleNextDate = () => {
      const next = new Date(selectedDate);
      next.setDate(selectedDate.getDate() + 1);
      const today = new Date();
      if (next <= today) {
        setSelectedDate(next);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-5/6 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Attendance Records</h2>
              <button 
                onClick={onClose} 
                className="text-white hover:text-indigo-100"
              >
                <X size={24} />
              </button>
            </div>
            <p className="opacity-90 mt-1">{courseName} • {groupName}</p>
          </div>
          
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Date Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
                <button 
                  onClick={handlePreviousDate}
                  className="p-2 rounded-full bg-white hover:bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="text-center flex items-center">
                  <CalendarIcon size={20} className="mr-2 text-indigo-600" />
                  <span className="font-medium text-indigo-800">{formatDate(selectedDate)}</span>
                </div>
                
                <button 
                  onClick={handleNextDate}
                  className="p-2 rounded-full bg-white hover:bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200"
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            ) : attendanceData ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{attendanceData.stats.present}</div>
                    <div className="text-sm text-green-600">Present</div>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-700">{attendanceData.stats.late}</div>
                    <div className="text-sm text-yellow-600">Late</div>
                  </div>
                  <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">{attendanceData.stats.absent}</div>
                    <div className="text-sm text-red-600">Absent</div>
                  </div>
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{attendanceData.stats.excused}</div>
                    <div className="text-sm text-blue-600">Excused</div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.attendance.map((record, idx) => (
                        <tr key={record.student._id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{record.student.name}</div>
                            <div className="text-sm text-gray-500">{record.student.studentId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(record.attendance.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.attendance.markedBy || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.attendance.markedAt ? new Date(record.attendance.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.attendance.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No attendance data available for this date</div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between">
              <button 
                onClick={() => {
                  // Logic to export attendance data for selected date
                  alert("This would export attendance data for " + formatDate(selectedDate));
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center"
              >
                <FileText size={16} className="mr-1" />
                Export Records
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  