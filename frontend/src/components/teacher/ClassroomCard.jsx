import React from "react";
import { PlusCircle, Book, Users, Calendar } from "lucide-react";

// ClassroomCard Component
export default function ClassroomCard  ({ classroom, onClick, isDark })  {
  return (
    <div 
      onClick={onClick}
      className={`${
        isDark 
          ? 'bg-gradient-to-r from-[#171F2A] to-[#121A24] border border-[#2A3441] hover:border-[#3D4E63]' 
          : 'bg-white border border-purple-100 hover:border-purple-300'
      } rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-indigo-800'}`}>
            {classroom?.courseName || "Unnamed Course"}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-indigo-600'}`}>
            {classroom.groupName || "No Group"} · {classroom.department || "No Department"}
          </p>
        </div>
        <div className={`${
          isDark ? 'bg-[#1D2B3A] text-blue-400' : 'bg-indigo-100 text-indigo-700'
        } h-10 w-10 flex items-center justify-center rounded-full`}>
          <Book size={18} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="flex items-center">
          <div className={`p-2 rounded-md mr-3 ${
            isDark ? 'bg-[#1D2B3A] text-blue-400' : 'bg-indigo-100 text-indigo-600'
          }`}>
            <Users size={16} />
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Students</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {classroom.students || 0}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`p-2 rounded-md mr-3 ${
            isDark ? 'bg-[#1D2B3A] text-blue-400' : 'bg-indigo-100 text-indigo-600'
          }`}>
            <Calendar size={16} />
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Created</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {classroom.createdAt ? new Date(classroom.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
