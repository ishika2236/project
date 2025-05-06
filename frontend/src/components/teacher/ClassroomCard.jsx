import React from "react";
import { Users , Clock, CheckCircle, ChevronRight} from "lucide-react";
export default function ClassroomCard({ classroom, onClick, isDark }) {
    return (
      <div 
        className={`${isDark 
          ? 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl' 
          : 'bg-gradient-to-br from-white to-indigo-50 border border-indigo-200'} 
          rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full transform hover:scale-105 duration-300`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-indigo-900'}`}>{classroom.courseName}</h3>
            <p className={`${isDark ? 'text-[#5E6E82]' : 'text-indigo-600'} text-sm`}>{classroom.groupName}</p>
          </div>
          <div className={`${isDark ? 'bg-gradient-to-r from-[#F2683C]/20 to-[#2F955A]/20' : 'bg-gradient-to-r from-pink-500 to-purple-600'} text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm`}>
            {classroom.department}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className={`flex items-center ${isDark ? 'text-white' : 'text-indigo-700'} mb-3`}>
            <Users size={16} className={`mr-2 ${isDark ? 'text-[#506EE5]' : 'text-purple-500'}`} />
            <span>{classroom.students} Students</span>
          </div>
          <div className={`flex items-center ${isDark ? 'text-white' : 'text-indigo-700'} mb-3`}>
            <Clock size={16} className={`mr-2 ${isDark ? 'text-[#506EE5]' : 'text-purple-500'}`} />
            <span>{classroom.nextClass}</span>
          </div>
          <div className={`flex items-center ${isDark ? 'text-white' : 'text-indigo-700'}`}>
            <CheckCircle size={16} className={`mr-2 ${isDark ? 'text-[#506EE5]' : 'text-purple-500'}`} />
            <span>Attendance: {classroom.attendanceRate}</span>
          </div>
        </div>
        
        <div className={`mt-6 pt-4 ${isDark ? 'border-t border-[#1E2733]' : 'border-t border-indigo-100'} flex justify-end`}>
          <button className={`${isDark ? 'bg-gradient-to-r from-[#506EE5]/60 via-[#222C42]/40 to-[#1D2229]' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow-md transition-all`}>
            Enter Classroom
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  }