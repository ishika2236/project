// CommonComponents.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import ThemeProvider, { useTheme } from '../../../context/ThemeProvider';

// Status badge component
export const StatusBadge = ({ status }) => {
    const {theme} = useTheme();
  let statusClass = "";
  
  if (theme === 'dark') {
    switch(status) {
      case 'Active':
        statusClass = "bg-[#2F955A]/20 text-[#4ADE80] border border-[#2F955A]/30";
        break;
      case 'Inactive':
        statusClass = "bg-[#F2683C]/20 text-[#F87171] border border-[#F2683C]/30";
        break;
      case 'On Leave':
        statusClass = "bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30";
        break;
      default:
        statusClass = "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  } else {
    switch(status) {
      case 'Active':
        statusClass = "bg-green-100 text-green-800 border border-green-200";
        break;
      case 'Inactive':
        statusClass = "bg-red-100 text-red-800 border border-red-200";
        break;
      case 'On Leave':
        statusClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
        break;
      default:
        statusClass = "bg-gray-100 text-gray-800 border border-gray-200";
    }
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
      {status}
    </span>
  );
};

// Attendance indicator component
export const AttendanceIndicator = ({ percentage, theme, currentTheme }) => {
  let colorClass = "";
  
  if (percentage >= 85) {
    colorClass = theme === 'dark' ? "bg-[#4ADE80]" : "bg-green-500";
  } else if (percentage >= 70) {
    colorClass = theme === 'dark' ? "bg-[#FBBF24]" : "bg-yellow-500";
  } else {
    colorClass = theme === 'dark' ? "bg-[#F87171]" : "bg-red-500";
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={currentTheme.text + " text-sm"}>{percentage}%</span>
    </div>
  );
};

// Pagination component
export const Pagination = ({ currentPage, totalPages, paginate, theme, currentTheme }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-1">
        <button 
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1 
              ? `${currentTheme.secondaryText} opacity-50` 
              : `${currentTheme.text} ${
                  theme === 'dark' 
                    ? 'hover:bg-[#121A22]' 
                    : 'hover:bg-gray-100'
                }`
          }`}
        >
          <ChevronRight className="rotate-180" size={16} />
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Calculate page numbers to show
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={i}
              onClick={() => paginate(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === pageNum
                  ? theme === 'dark'
                    ? 'bg-[#121A22] text-white'
                    : 'bg-gray-200 text-gray-800'
                  : `${currentTheme.text} ${
                      theme === 'dark' 
                        ? 'hover:bg-[#121A22]' 
                        : 'hover:bg-gray-100'
                    }`
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button 
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages 
              ? `${currentTheme.secondaryText} opacity-50` 
              : `${currentTheme.text} ${
                  theme === 'dark' 
                    ? 'hover:bg-[#121A22]' 
                    : 'hover:bg-gray-100'
                }`
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// User Avatar component
export const UserAvatar = ({ firstName, theme, currentTheme }) => {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      theme === 'dark' ? 'bg-[#121A22]' : 'bg-[#F4F6F6]'
    } ${currentTheme.text}`}>
      {firstName.charAt(0)}
    </div>
  );
};

// User Info component
export const UserInfo = ({ firstName, lastName, email, currentTheme }) => {
  return (
    <div>
      <div className={currentTheme.text}>{firstName} {lastName}</div>
      <div className={`text-xs ${currentTheme.secondaryText}`}>{email}</div>
    </div>
  );
};