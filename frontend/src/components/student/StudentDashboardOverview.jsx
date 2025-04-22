import React from "react";
import { useTheme } from "../../context/ThemeProvider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
const StudentDashboardOverview = () => {
    const COLORS = ['#2E67FF', '#F2683C'];
    const {themeConfig, theme} = useTheme();
    const attendanceData = [
        { name: 'Programming 101', present: 12, absent: 2, total: 14, percentage: 86 },
        { name: 'Data Structures', present: 8, absent: 1, total: 9, percentage: 89 },
        { name: 'Web Development', present: 15, absent: 3, total: 18, percentage: 83 },
        { name: 'Mobile Apps', present: 7, absent: 0, total: 7, percentage: 100 },
      ];

    return (
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${themeConfig[theme].gradient.text}`}>
          My Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className={`${themeConfig[theme].card} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Recent Activity</h3>
            <div className="space-y-3">
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm ${themeConfig[theme].text}`}>New material added to Web Development</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Today at 2:30 PM</p>
              </div>
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm ${themeConfig[theme].text}`}>Attended Data Structures class</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Yesterday at 10:00 AM</p>
              </div>
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm ${themeConfig[theme].text}`}>Submitted assignment for Programming 101</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Apr 10, 2025</p>
              </div>
            </div>
          </div>
          
          {/* Upcoming Classes */}
          <div className={`${themeConfig[theme].card} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Upcoming Classes</h3>
            <div className="space-y-3">
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm font-medium ${themeConfig[theme].text}`}>Web Development</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Mon, Apr 14 - 2:00 PM</p>
              </div>
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm font-medium ${themeConfig[theme].text}`}>Mobile Apps</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Tue, Apr 15 - 11:00 AM</p>
              </div>
              <div className={`p-3 ${themeConfig[theme].button.gradient} rounded-md`}>
                <p className={`text-sm font-medium ${themeConfig[theme].text}`}>Data Structures</p>
                <p className={`text-xs ${themeConfig[theme].secondaryText}`}>Wed, Apr 16 - 9:30 AM</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendance Summary */}
        <div className={`${themeConfig[theme].card} p-4 rounded-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Attendance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attendanceData.map((course, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className={`text-sm font-medium mb-2 ${themeConfig[theme].text}`}>{course.name}</p>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Present', value: course.present },
                          { name: 'Absent', value: course.absent }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Present', value: course.present },
                          { name: 'Absent', value: course.absent }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend align="center" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className={`text-lg font-bold ${themeConfig[theme].gradient.text}`}>
                  {course.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default StudentDashboardOverview;