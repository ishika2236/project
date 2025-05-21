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
export function BulkAttendanceModal({ isOpen, onClose, classId, courseName, groupName, students }) {
    const [selectedStatus, setSelectedStatus] = useState("present");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (isOpen) {
        // Reset selections when modal opens
        setSelectedStudents([]);
        setSelectedStatus("present");
      }
    }, [isOpen]);
  
    const handleToggleStudent = (studentId) => {
      if (selectedStudents.includes(studentId)) {
        setSelectedStudents(selectedStudents.filter(id => id !== studentId));
      } else {
        setSelectedStudents([...selectedStudents, studentId]);
      }
    };
  
    const handleSelectAll = () => {
      if (selectedStudents.length === students.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(students.map(student => student.id));
      }
    };
  
    const handleSubmit = async () => {
      if (selectedStudents.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const attendanceData = selectedStudents.map(studentId => ({
          studentId,
          status: selectedStatus,
          notes: `Bulk marked as ${selectedStatus} by teacher`
        }));
        
        await dispatch(bulkMarkAttendance({ 
          classId, 
          attendanceData 
        })).unwrap();
        
        onClose();
      } catch (err) {
        setError(err || "Failed to mark attendance");
      } finally {
        setLoading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Bulk Mark Attendance</h2>
              <button 
                onClick={onClose} 
                className="text-white hover:text-blue-100"
              >
                <X size={24} />
              </button>
            </div>
            <p className="opacity-90 mt-1">{courseName} • {groupName}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Set Status for Selected Students
              </label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedStatus("present")}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === "present" 
                      ? "bg-green-500 text-white" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Present
                </button>
                <button 
                  onClick={() => setSelectedStatus("late")}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === "late" 
                      ? "bg-yellow-500 text-white" 
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  Late
                </button>
                <button 
                  onClick={() => setSelectedStatus("absent")}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === "absent" 
                      ? "bg-red-500 text-white" 
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  Absent
                </button>
                <button 
                  onClick={() => setSelectedStatus("excused")}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === "excused" 
                      ? "bg-blue-500 text-white" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Excused
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                <h3 className="font-medium text-gray-700">Select Students</h3>
                <button 
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedStudents.length === students.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {students.map(student => (
                  <div 
                    key={student.id}
                    className="flex items-center px-6 py-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <input 
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleToggleStudent(student.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        Current: {student.status === "waiting" ? "Not marked" : student.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Selected {selectedStudents.length} of {students.length} students
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || selectedStudents.length === 0}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                    loading || selectedStudents.length === 0 
                      ? "opacity-60 cursor-not-allowed" 
                      : "hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Processing..." : "Apply to Selected"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  