import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Mail, Trash2 } from 'lucide-react';

const StudentsList = ({ students }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  if (students.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className={colors.secondaryText}>No students in this group yet</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-gray-800">
              <td className={`px-6 py-4 whitespace-nowrap ${colors.text}`}>
                {student.firstName + " " + student.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Mail size={14} className={`${colors.secondaryText} mr-2`} />
                  <span className={colors.secondaryText}>{student.email}</span>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${colors.secondaryText}`}>
                {student.joinedAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="text-red-500 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;