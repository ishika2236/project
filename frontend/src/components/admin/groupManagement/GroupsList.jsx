import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Users, Edit, Trash2, Eye } from 'lucide-react';

const GroupsList = ({ groups, onEdit, onView, onDelete }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  // Get border color based on theme
  const getBorderColor = () => {
    return theme === 'dark' ? 'border-[#1E2733]' : 'border-slate-200';
  };
  
  // Get hover background color based on theme
  const getHoverBgColor = () => {
    return theme === 'dark' ? 'hover:bg-[#1A1D25]/50' : 'hover:bg-slate-50';
  };
  
  // Get button hover background color
  const getButtonHoverBg = () => {
    return theme === 'dark' ? 'hover:bg-[#1A1D25]' : 'hover:bg-slate-100';
  };

  if (groups.length === 0) {
    return (
      <div className={`${colors.card} p-4 mt-4`}>
        <p className={`${colors.secondaryText} text-center`}>
          No groups found
        </p>
      </div>
    );
  }

  return (
    <div className={`${colors.card} mt-4 overflow-hidden`}>
      <div className="max-h-96 overflow-y-auto">
        {groups.map(group => (
          <div 
            key={group.id} 
            className={`p-4 border-b last:border-b-0 ${getBorderColor()} ${getHoverBgColor()} transition-colors cursor-pointer`}
          >
            <div className="flex justify-between items-center">
              <div onClick={() => onView(group)}>
                <h3 className={`font-medium ${colors.text}`}>{group.name}</h3>
                <div className="flex items-center mt-1">
                  <Users size={14} className={`${colors.secondaryText} mr-1`} />
                  <span className={`text-sm ${colors.secondaryText}`}>
                    {group.studentCount} students
                  </span>
                </div>
                <p className={`text-sm ${colors.secondaryText} mt-1`}>
                  Teacher: {group?.mentor?.firstName ? `${group.mentor.firstName} ${group.mentor.lastName}` : 'Not assigned'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(group);
                  }}
                  className={`p-1 rounded-full ${getButtonHoverBg()}`}
                >
                  <Eye size={16} className={colors.icon} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(group);
                  }}
                  className={`p-1 rounded-full ${getButtonHoverBg()}`}
                >
                  <Edit size={16} className={colors.icon} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this group?')) {
                      onDelete(group._id);
                    }
                  }}
                  className={`p-1 rounded-full ${getButtonHoverBg()}`}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;