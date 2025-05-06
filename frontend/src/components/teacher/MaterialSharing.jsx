import React from "react";
import { useTheme } from "../../context/ThemeProvider";
import { PlusCircle, File } from "lucide-react";

export default function MaterialsSharing() {
    const { themeConfig, theme } = useTheme();
    const currentTheme = themeConfig[theme];
    
    const materials = [
      { id: 1, name: "Week 5 Lecture Slides", type: "PDF", size: "2.4 MB", date: "May 2, 2025" },
      { id: 2, name: "Algorithm Assignment Guidelines", type: "DOCX", size: "1.1 MB", date: "May 1, 2025" },
      { id: 3, name: "Programming Exercise Solutions", type: "ZIP", size: "4.6 MB", date: "Apr 28, 2025" }
    ];
  
    return (
      <div className={`p-6 rounded-xl ${currentTheme.card}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-medium ${currentTheme.text}`}>Class Materials</h3>
          <button className={`${currentTheme.button.primary} px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors text-sm`}>
            <PlusCircle size={16} className="mr-2" />
            Upload Material
          </button>
        </div>
        
        <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-[#121A22]' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${currentTheme.secondaryText}`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${currentTheme.secondaryText}`}>Type</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${currentTheme.secondaryText}`}>Size</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${currentTheme.secondaryText}`}>Date Added</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${currentTheme.secondaryText}`}></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'bg-[#0A0E13] divide-[#1E2733]' : 'bg-white divide-gray-200'}`}>
              {materials.map(material => (
                <tr key={material.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <File size={16} className={`mr-2 ${currentTheme.secondaryText}`} />
                      <div className={currentTheme.text}>{material.name}</div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {material.type}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {material.size}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.secondaryText}`}>
                    {material.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className={`${theme === 'dark' ? 'text-[#506EE5]' : 'text-indigo-600'} hover:opacity-80`}>
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  