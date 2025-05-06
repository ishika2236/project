import React from "react";
import { UserCheck } from "lucide-react";
export default function ActiveAttendance({ classroom, onClose, isDark }) {
    // Simulated attendance data
    const [students, setStudents] = useState([
      { id: 1, name: "Alex Johnson", status: "present", method: "Face recognition", time: "10:28 AM" },
      { id: 2, name: "Jamie Smith", status: "present", method: "Face recognition", time: "10:25 AM" },
      { id: 3, name: "Casey Brown", status: "present", method: "Face recognition", time: "10:29 AM" },
      { id: 4, name: "Morgan Davis", status: "waiting", method: null, time: null },
      { id: 5, name: "Riley Wilson", status: "present", method: "Face recognition", time: "10:31 AM" },
      { id: 6, name: "Taylor Thompson", status: "waiting", method: null, time: null },
    ]);
  
    const [attendanceTime, setAttendanceTime] = useState(5); // Minutes
    
    // Function to manually mark a student present
    const markStudentPresent = (studentId) => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, status: 'present', method: 'Manual entry', time: currentTime }
          : student
      ));
    };
  
    // Calculate attendance stats
    const presentCount = students.filter(s => s.status === 'present').length;
    const waitingCount = students.filter(s => s.status === 'waiting').length;
  
    return (
      <div className={`${isDark 
        ? 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl' 
        : 'bg-white bg-opacity-90 border border-teal-200'} rounded-xl shadow-lg overflow-hidden backdrop-blur-sm`}>
        <div className={`${isDark 
          ? 'bg-gradient-to-r from-[#1A2520]/80 to-[#0A0E13]/90 border-b border-[#2F955A]/30' 
          : 'bg-gradient-to-r from-emerald-400 to-teal-500'} text-white p-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium">Attendance in Progress</h2>
              <p className="opacity-90 mt-1">{classroom.courseName} • {classroom.groupName}</p>
            </div>
            <div className={`text-right ${isDark ? 'bg-[#0A0E13]/40 border border-[#2F955A]/20' : 'bg-white bg-opacity-20'} p-4 rounded-lg backdrop-blur-sm`}>
              <div className="text-3xl font-bold">{attendanceTime}:00</div>
              <p className="opacity-90">Time Remaining</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className={`font-medium ${isDark ? 'text-[#2F955A]' : 'text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600'}`}>Real-time Attendance</h3>
              <p className={`${isDark ? 'text-[#5E6E82]' : 'text-teal-600'} text-sm`}>Students can mark attendance via face recognition or manual entry</p>
            </div>
            <div className="flex gap-2">
              <button className={`px-4 py-2 ${isDark 
                ? 'bg-gradient-to-r from-[#121A22] to-[#0A0E13]/80 border border-[#1E2733]' 
                : 'bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200'} rounded-lg ${isDark ? 'text-white' : 'text-indigo-700'} hover:shadow-md transition-all`}>
                Set Time
              </button>
              <button 
                onClick={onClose}
                className={`px-4 py-2 ${isDark 
                  ? 'bg-gradient-to-r from-[#251A1A]/80 to-[#0A0E13]/90 border border-[#F2683C]/20' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 border border-red-200'} rounded-lg ${isDark ? 'text-white' : 'text-red-700'} hover:shadow-md transition-all`}
              >
                End Session
              </button>
            </div>
          </div>
          
          <div className={`${isDark ? 'border border-[#1E2733]' : 'border border-indigo-200'} rounded-lg overflow-hidden shadow-sm`}>
            <table className="min-w-full divide-y divide-indigo-200">
              <thead className={`${isDark ? 'bg-[#121A22]' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-800'} uppercase tracking-wider`}>Student</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-800'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-800'} uppercase tracking-wider`}>Method</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-800'} uppercase tracking-wider`}>Time</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-800'} uppercase tracking-wider`}>Action</th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-[#0A0E13] divide-y divide-[#1E2733]' : 'bg-white divide-y divide-indigo-100'}`}>
                {students.map(student => (
                  <tr key={student.id} className={`${isDark ? 'hover:bg-[#121A22]' : 'hover:bg-indigo-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-indigo-900'}`}>{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === "present" ? (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isDark 
                          ? 'bg-[#1A2520]/40 text-[#2F955A] border border-[#2F955A]/30' 
                          : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200'} shadow-sm`}>
                          Present
                        </span>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isDark 
                          ? 'bg-[#121A22]/40 text-[#5E6E82] border border-[#1E2733]' 
                          : 'bg-gradient-to-r from-gray-100 to-indigo-100 text-indigo-800 border border-indigo-200'} shadow-sm`}>
                          Waiting
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}>
                      {student.method || "—"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}>
                      {student.time || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === "waiting" && (
                        <button 
                          onClick={() => markStudentPresent(student.id)}
                          className={`px-3 py-1 text-xs ${isDark 
                            ? 'bg-[#1A2520]/80 text-[#2F955A] border border-[#2F955A]/30 hover:bg-[#1A2520]' 
                            : 'bg-teal-100 text-teal-800 border border-teal-200 hover:bg-teal-200'} rounded-full shadow-sm transition-colors flex items-center`}
                        >
                          <UserCheck size={12} className="mr-1" />
                          Mark Present
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={`mt-4 p-3 ${isDark 
            ? 'bg-[#121A22] border border-[#1E2733]' 
            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100'} rounded-lg shadow-sm`}>
            <div className="flex items-center justify-around">
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 rounded-full ${isDark 
                  ? 'bg-[#2F955A]' 
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'} mr-2 shadow-sm`}></span> 
                <span className={`${isDark ? 'text-white' : 'text-indigo-900'} font-medium`}>Present: {presentCount}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 rounded-full ${isDark 
                  ? 'bg-[#5E6E82]' 
                  : 'bg-gradient-to-r from-gray-300 to-indigo-200'} mr-2 shadow-sm`}></span> 
                <span className={`${isDark ? 'text-white' : 'text-indigo-900'} font-medium`}>Waiting: {waitingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }