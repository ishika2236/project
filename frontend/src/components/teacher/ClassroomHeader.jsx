import React from "react";
import { Users, CheckCircle } from "lucide-react";
export default function ClassroomHeader({ classroom, onAttendanceToggle, isDark }) {
    return (
      <div className={`${isDark 
        ? 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl' 
        : 'bg-gradient-to-r from-white to-indigo-50 border border-indigo-200'} rounded-xl shadow-md p-6`}>
        <div className="flex justify-between items-center">
          <div>
            <div className={`text-sm ${isDark ? 'text-[#506EE5]' : 'text-pink-600'} font-medium mb-1`}>{classroom.department}</div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-800'}`}>
              {classroom.courseName} • {classroom.groupName}
            </h2>
            <div className={`mt-2 flex items-center ${isDark ? 'text-[#5E6E82]' : 'text-indigo-600'}`}>
              <Users size={16} className={`mr-1 ${isDark ? 'text-[#506EE5]' : 'text-purple-500'}`} />
              <span className="text-sm">{classroom.students} Students</span>
            </div>
          </div>
          <button 
            onClick={onAttendanceToggle}
            className={`${isDark 
              ? 'bg-gradient-to-r from-[#1A2520]/80 to-[#0A0E13]/90 border-2 border-[#2F955A]/50 shadow-[inset_0_0_15px_rgba(47,149,90,0.3)]' 
              : 'bg-gradient-to-r from-emerald-400 to-teal-500'} text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all`}
          >
            <CheckCircle size={18} className="mr-2" />
            Take Attendance
          </button>
        </div>
      </div>
    );
  }