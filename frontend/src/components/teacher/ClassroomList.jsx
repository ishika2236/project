import React from "react";
import { PlusCircle } from "lucide-react";
import ClassroomCard from './ClassroomCard';
import { useTheme } from "../../context/ThemeProvider";

export default function ClassroomList({ classrooms, onSelect }) {
  const { isDark, themeConfig } = useTheme();
  console.log(classrooms);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-medium ${
          isDark 
            ? themeConfig.dark.gradient.text
            : themeConfig.light.gradient.premium
        }`}>
          Your Teaching Schedule
        </h2>
        <button className={`
          ${isDark 
            ? themeConfig.dark.button.primary
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md'
          } 
          px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all`}>
          <PlusCircle size={18} className="mr-2" />
          New Class
        </button>
      </div>
      
      {classrooms.length === 0 ? (
        <div className={`text-center p-12 rounded-lg ${
          isDark 
            ? 'bg-[#1E2733] text-white' 
            : 'bg-slate-100 text-slate-500'
        }`}>
          <p>No classrooms assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map(classroom => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              onClick={() => onSelect(classroom)}
            />
          ))}
        </div>
      )}
    </div>
  );
}