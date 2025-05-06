import React from "react";
import { PlusCircle, Users,Calendar  } from "lucide-react";

export default function HomeworkPanel() {
    const { themeConfig, theme } = useTheme();
    const currentTheme = themeConfig[theme];
    
    const homework = [
      { id: 1, title: "Algorithm Complexity Analysis", due: "May 10, 2025", submissions: 12, status: "active" },
      { id: 2, title: "Tree Implementation Exercise", due: "May 3, 2025", submissions: 28, status: "closed" }
    ];
  
    return (
      <div className={`p-6 rounded-xl ${currentTheme.card}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-medium ${currentTheme.text}`}>Homework Assignments</h3>
          <button className={`${currentTheme.button.primary} px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors text-sm`}>
            <PlusCircle size={16} className="mr-2" />
            Assign Homework
          </button>
        </div>
        
        <div className="space-y-4">
          {homework.map(hw => (
            <div key={hw.id} className={`${theme === 'dark' ? 'bg-[#121A22] border-[#1E2733]' : 'bg-white border-gray-200'} border rounded-lg p-4 flex justify-between items-center`}>
              <div>
                <div className={currentTheme.text}>{hw.title}</div>
                <div className={`flex items-center ${currentTheme.secondaryText} text-sm mt-1`}>
                  <Calendar size={14} className="mr-2" />
                  Due: {hw.due}
                  <span className="mx-2">•</span>
                  <Users size={14} className="mr-2" />
                  {hw.submissions} submissions
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hw.status === 'active' 
                    ? theme === 'dark' ? 'bg-[#1A2520] text-green-400' : 'bg-green-100 text-green-800'
                    : theme === 'dark' ? 'bg-[#1E2733] text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  {hw.status === 'active' ? 'Active' : 'Closed'}
                </span>
                <button className={`ml-4 px-3 py-1.5 ${theme === 'dark' ? 'bg-[#1E2733] text-gray-300' : 'bg-gray-100 text-gray-700'} rounded hover:opacity-80 transition-colors text-sm`}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  