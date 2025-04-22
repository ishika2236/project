// components/views/AttendanceManagement.jsx (completed)
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';

import { Download, Filter, Search, Calendar, Clock, Check, X, MoreHorizontal } from 'lucide-react';

const AttendanceManagement = ({ course, group, classItem }) => {
  const { themeConfig, theme } = useTheme();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simulated data fetch
  useEffect(() => {
    if (course && group && classItem) {
      // Mock API call for attendance data
      setTimeout(() => {
        setAttendanceData([
          { id: 1, name: 'Alex Johnson', email: 'alex.j@example.edu', status: 'present', checkinTime: '10:02 AM', notes: '' },
          { id: 2, name: 'Jamie Smith', email: 'jamie.s@example.edu', status: 'present', checkinTime: '9:58 AM', notes: '' },
          { id: 3, name: 'Casey Wong', email: 'casey.w@example.edu', status: 'absent', checkinTime: null, notes: 'Doctor appointment' },
          { id: 4, name: 'Taylor Patel', email: 'taylor.p@example.edu', status: 'late', checkinTime: '10:22 AM', notes: 'Traffic issue' },
          { id: 5, name: 'Morgan Lee', email: 'morgan.l@example.edu', status: 'present', checkinTime: '10:05 AM', notes: '' },
          { id: 6, name: 'Riley Garcia', email: 'riley.g@example.edu', status: 'present', checkinTime: '9:55 AM', notes: '' },
          { id: 7, name: 'Jordan Chen', email: 'jordan.c@example.edu', status: 'absent', checkinTime: null, notes: 'Family emergency' },
          { id: 8, name: 'Cameron Nguyen', email: 'cameron.n@example.edu', status: 'present', checkinTime: '10:01 AM', notes: '' }
        ]);
        setLoading(false);
      }, 600);
    }
  }, [course, group, classItem]);

  const filteredAttendance = attendanceData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const attendanceStats = {
    present: attendanceData.filter(s => s.status === 'present').length,
    late: attendanceData.filter(s => s.status === 'late').length,
    absent: attendanceData.filter(s => s.status === 'absent').length,
    total: attendanceData.length
  };

  if (!course || !group || !classItem) {
    return (
      <div className={`p-8 text-center ${themeConfig[theme].secondaryText}`}>
        Please select a class to view attendance data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>{classItem.title}</h2>
          <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
            {course.name} • {group.name}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.primary}`}>
            <Download size={18} className="mr-2 inline" />
            Export
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6`}>
        <div className={`${themeConfig[theme].card} rounded-lg p-4`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#2F955A]/20' : 'bg-green-100'
            }`}>
              <Check size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div className="ml-4">
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Present</p>
              <p className={`text-2xl font-bold ${themeConfig[theme].text}`}>
                {attendanceStats.present} 
                <span className={`text-sm ml-1 font-normal ${themeConfig[theme].secondaryText}`}>
                  ({Math.round((attendanceStats.present / attendanceStats.total) * 100)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className={`${themeConfig[theme].card} rounded-lg p-4`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#F2683C]/20' : 'bg-orange-100'
            }`}>
              <Clock size={24} className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
            </div>
            <div className="ml-4">
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Late</p>
              <p className={`text-2xl font-bold ${themeConfig[theme].text}`}>
                {attendanceStats.late}
                <span className={`text-sm ml-1 font-normal ${themeConfig[theme].secondaryText}`}>
                  ({Math.round((attendanceStats.late / attendanceStats.total) * 100)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className={`${themeConfig[theme].card} rounded-lg p-4`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <X size={24} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
            </div>
            <div className="ml-4">
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Absent</p>
              <p className={`text-2xl font-bold ${themeConfig[theme].text}`}>
                {attendanceStats.absent}
                <span className={`text-sm ml-1 font-normal ${themeConfig[theme].secondaryText}`}>
                  ({Math.round((attendanceStats.absent / attendanceStats.total) * 100)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${themeConfig[theme].card} rounded-lg p-6 mt-6`}>
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeConfig[theme].secondaryText}`} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg w-full md:w-64 outline-none ${
                theme === 'dark' 
                  ? 'bg-[#121A22] border border-[#1E2733] text-white placeholder-gray-500' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterStatus === 'all' 
                  ? themeConfig[theme].button.primary 
                  : theme === 'dark'
                    ? 'bg-[#121A22] border border-[#1E2733] text-white'
                    : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('present')}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterStatus === 'present' 
                  ? theme === 'dark'
                    ? 'bg-[#2F955A]/20 border border-[#2F955A]/50 text-green-300'
                    : 'bg-green-100 border border-green-300 text-green-800'
                  : theme === 'dark'
                    ? 'bg-[#121A22] border border-[#1E2733] text-white'
                    : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Present
            </button>
            <button 
              onClick={() => setFilterStatus('late')}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterStatus === 'late' 
                  ? theme === 'dark'
                    ? 'bg-[#F2683C]/20 border border-[#F2683C]/50 text-orange-300'
                    : 'bg-orange-100 border border-orange-300 text-orange-800'
                  : theme === 'dark'
                    ? 'bg-[#121A22] border border-[#1E2733] text-white'
                    : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Late
            </button>
            <button 
              onClick={() => setFilterStatus('absent')}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterStatus === 'absent' 
                  ? theme === 'dark'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                    : 'bg-red-100 border border-red-300 text-red-800'
                  : theme === 'dark'
                    ? 'bg-[#121A22] border border-[#1E2733] text-white'
                    : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Absent
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-12 animate-pulse rounded-lg ${theme === 'dark' ? 'bg-[#121A22]/60' : 'bg-gray-100'}`} 
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 font-medium ${themeConfig[theme].secondaryText}`}>Student</th>
                  <th className={`text-left py-3 font-medium ${themeConfig[theme].secondaryText}`}>Status</th>
                  <th className={`text-left py-3 font-medium ${themeConfig[theme].secondaryText}`}>Check-in Time</th>
                  <th className={`text-left py-3 font-medium ${themeConfig[theme].secondaryText}`}>Notes</th>
                  <th className={`text-right py-3 font-medium ${themeConfig[theme].secondaryText}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(student => (
                  <tr 
                    key={student.id} 
                    className={`border-b ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}
                  >
                    <td className="py-4">
                      <div>
                        <p className={`font-medium ${themeConfig[theme].text}`}>{student.name}</p>
                        <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{student.email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'present'
                          ? theme === 'dark'
                            ? 'bg-[#2F955A]/20 text-green-300'
                            : 'bg-green-100 text-green-800'
                          : student.status === 'late'
                            ? theme === 'dark'
                              ? 'bg-[#F2683C]/20 text-orange-300'
                              : 'bg-orange-100 text-orange-800'
                            : theme === 'dark'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className={`py-4 ${themeConfig[theme].text}`}>
                      {student.checkinTime || '-'}
                    </td>
                    <td className={`py-4 ${themeConfig[theme].secondaryText}`}>
                      {student.notes || '-'}
                    </td>
                    <td className="py-4 text-right">
                      <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'}`}>
                        <MoreHorizontal size={18} className={themeConfig[theme].secondaryText} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;

