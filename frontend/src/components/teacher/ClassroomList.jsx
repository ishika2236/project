import React from "react";
import ClassroomCard from './ClassroomCard'
import { PlusCircle } from "lucide-react";
export default function ClassroomList({ classrooms, onSelect, isDark }) {
    console.log(classrooms);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700'}`}>Your Teaching Schedule</h2>
          <button className={`${isDark ? 'bg-gradient-to-r from-[#506EE5]/60 to-[#1D2229] border-2 border-[#1E4FFF]/30' : 'bg-gradient-to-r from-pink-500 to-purple-600'} text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all`}>
            <PlusCircle size={18} className="mr-2" />
            New Class
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map(classroom => (
            <ClassroomCard 
              key={classroom.id} 
              classroom={classroom} 
              onClick={() => onSelect(classroom)} 
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    );
  }


  