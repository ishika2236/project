import React from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

export default function ClassHistory({ isDark, currentTheme }) {
  // Sample past classes data
  const pastClasses = [
    {
      id: 1,
      date: "April 29, 2025",
      time: "10:30 AM - 12:00 PM",
      topic: "Sorting Algorithms",
      attendanceCount: 26,
      totalStudents: 28,
      attendancePercentage: "93%",
      location: "Room 302",
      materials: ["Sorting algorithms handout", "Practice problems worksheet"]
    },
    {
      id: 2,
      date: "April 22, 2025",
      time: "10:30 AM - 12:00 PM",
      topic: "Big O Notation & Algorithm Analysis",
      attendanceCount: 27,
      totalStudents: 28,
      attendancePercentage: "96%",
      location: "Room 302",
      materials: ["Algorithm complexity chart", "Problem set"]
    },
    {
      id: 3,
      date: "April 15, 2025",
      time: "10:30 AM - 12:00 PM",
      topic: "Introduction to Algorithms",
      attendanceCount: 28,
      totalStudents: 28,
      attendancePercentage: "100%",
      location: "Room 302",
      materials: ["Course syllabus", "Intro to algorithms slides"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-indigo-900'}`}>Past Classes</h3>
      </div>

      <div className="space-y-4">
        {pastClasses.map(cls => (
          <div 
            key={cls.id} 
            className={`${
              isDark 
                ? 'bg-[#121A22] border-[#1E2733]' 
                : 'bg-white border-gray-200'
            } border rounded-lg p-4`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>
                  <Calendar size={14} className="mr-2" />
                  {cls.date}
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-2" />
                  {cls.time}
                </div>
                <div className={`${isDark ? 'text-white' : 'text-indigo-900'} font-medium`}>{cls.topic}</div>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isDark ? 'bg-[#1E2733] text-green-400' : 'bg-green-50 text-green-700'
              }`}>
                <CheckCircle size={14} className="mr-1" />
                Completed
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 ${
              isDark ? 'border-t border-[#1E2733]' : 'border-t border-gray-100'
            }`}>
              {/* Location */}
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                <span className="font-medium">Location:</span> {cls.location}
              </div>
              
              {/* Attendance */}
              <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                <Users size={14} className="mr-2" />
                <span className="font-medium">Attendance:</span>
                <span className="ml-1">{cls.attendanceCount}/{cls.totalStudents} ({cls.attendancePercentage})</span>
              </div>
              
              {/* Materials */}
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm col-span-2`}>
                <span className="font-medium">Materials:</span> {cls.materials.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}