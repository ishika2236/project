import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Users, Edit, Trash2, Eye } from 'lucide-react';

const GroupsList = ({ groups, onEdit, onView, onDelete }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  if (groups.length === 0) {
    return (
      <div className={`${colors.card} rounded-lg p-4 mt-4`}>
        <p className={`${colors.secondaryText} text-center`}>
          No groups found
        </p>
      </div>
    );
  }

  return (
    <div className={`${colors.card} rounded-lg mt-4 overflow-hidden`}>
      <div className="max-h-96 overflow-y-auto">
        {groups.map(group => (
          <div 
            key={group.id} 
            className={`p-4 border-b last:border-b-0 border-gray-700 hover:bg-opacity-50 hover:bg-gray-800 transition-colors cursor-pointer`}
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
                  Teacher: {group?.mentor?.firstName + " "+ group?.mentor?.lastName}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(group);
                  }}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <Eye size={16} className={colors.icon} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(group);
                  }}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <Edit size={16} className={colors.icon} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this group?')) {
                      onDelete(group.id);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-700"
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
export default  GroupsList;