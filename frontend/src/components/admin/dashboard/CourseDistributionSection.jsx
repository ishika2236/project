import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Book, ChevronRight, Users, CheckCircle, Clock, PieChart as PieChartIcon } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import SectionHeader from './commonComponents/SectionHeader';
import { useNavigate } from 'react-router-dom';


// Function to generate consistent colors based on department name
const generateColor = (text) => {
  const colors = [
    // Blues from your theme
    '#506EE5', '#3B82F6', '#2E67FF', '#4F46E5', '#60A5FA', 
     '#2F955A', '#34D399',
    // Oranges from your theme
    '#F2683C', '#F97316', '#FBBF24', '#F59E0B',
    // Reds
    '#E74C3C', '#ef4444',
  
   
  ];
  
  // Simple hash function to get consistent color for same text
  const charSum = text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
};



const DepartmentDistributionChart = ({ coursesData }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  // Group courses by department
  const departmentGroups = coursesData.reduce((acc, course) => {
    const dept = course.department || 'Uncategorized';
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        count: 0,
        color: course.color || '#cccccc'
      };
    }
    acc[dept].count += 1;
    return acc;
  }, {});

  // Convert to array for chart
  const chartData = Object.values(departmentGroups);

  // Ensure we have valid data
  const validChartData = chartData.length > 0 ? chartData : [
    { name: 'No Data', count: 1, color: '#cccccc' }
  ];

  return (
    <div className={`${colors.card} p-6 rounded-xl h-full`}>
      <h3 className={`${colors.text} text-lg font-semibold mb-4`}>Department Distribution</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={validChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="count"
            nameKey="name"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {validChartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={theme === 'dark' ? '#1E2733' : '#fff'} 
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} courses`, 'Count']}
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
              borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
              color: theme === 'dark' ? '#fff' : '#333'
            }}
          />
          <Legend 
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span className={colors.text}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {validChartData.map((dept, index) => (
          <div 
            key={index} 
            className={`${theme === 'dark' ? 'bg-[#1E2733]/30' : 'bg-gray-50'} p-3 rounded-lg flex items-center gap-2`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
            <div>
              <h5 className={`${colors.text} text-sm font-medium`}>{dept.name}</h5>
              <span className={`${colors.secondaryText} text-xs`}>{dept.count} courses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default DepartmentDistributionChart;

export default function CourseDistributionSection({ coursesData }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  const navigate = useNavigate();
  
  // Process the courses data for chart display
  const processedCourseData = coursesData.map(course => ({
    id: course._id,
    name: course.courseName,
    code: course.courseCode,
    students: course.enrolledStudents.length,
    maxCapacity: course.maxCapacity,
    department: course.department?.name || 'Unknown Department',
    departmentCode: course.department?.code || 'N/A',
    coordinator: course.courseCoordinator || 'Not Assigned',
    academicYear: course.academicYear,
    semester: course.semester,
    description: course.courseDescription,
    credits: course.credits,
    isActive: course.isActive,
    color: generateColor(course.department?.name || course.courseName)
  }));
  
  // Get available courses (active courses with available capacity)
  const availableCourses = processedCourseData.filter(
    course => course.isActive && course.students < course.maxCapacity
  );
  
  // Limit to 8 courses for display
  const displayCourses = processedCourseData.slice(0, 8);
  
  // Calculate total enrolled students
  const totalEnrolledStudents = processedCourseData.reduce((total, course) => total + course.students, 0);
  
  // Generate department-based data for pie chart
  const departmentData = processedCourseData.reduce((acc, course) => {
    const deptName = course.department;
    const existingDept = acc.find(item => item.name === deptName);
    
    if (existingDept) {
      existingDept.count += 1;
      existingDept.students += course.students;
    } else {
      acc.push({
        name: deptName,
        count: 1,
        students: course.students,
        color: course.color
      });
    }
    
    return acc;
  }, []);
  
  const handleNavigateToCourseInfo = () => {
    navigate('/admin/manageCourses');
  };

  // Ensure we have valid data for the chart
  const validChartData = departmentData.length > 0 ? departmentData : [
    { name: 'No Data', students: 1, color: '#cccccc' }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 mb-10 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
      <SectionHeader 
        title="Course Overview" 
        subtitle="Summary and distribution of all courses"
      />
      
      {/* Key Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${colors.card} p-4 rounded-xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
              <Book size={20} className={colors.icon} />
            </div>
            <div>
              <h3 className={`${colors.secondaryText} text-sm`}>Total Courses</h3>
              <h2 className={`${colors.text} text-2xl font-bold`}>{processedCourseData.length}</h2>
            </div>
          </div>
        </div>
        
        <div className={`${colors.card} p-4 rounded-xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
              <Users size={20} className={colors.icon} />
            </div>
            <div>
              <h3 className={`${colors.secondaryText} text-sm`}>Total Students</h3>
              <h2 className={`${colors.text} text-2xl font-bold`}>{totalEnrolledStudents}</h2>
            </div>
          </div>
        </div>
        
        <div className={`${colors.card} p-4 rounded-xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
              <CheckCircle size={20} className={colors.icon} />
            </div>
            <div>
              <h3 className={`${colors.secondaryText} text-sm`}>Available Courses</h3>
              <h2 className={`${colors.text} text-2xl font-bold`}>{availableCourses.length}</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Courses Tile */}
      <div className={`${colors.card} p-4 rounded-xl mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className={colors.icon} />
            <h3 className={`${colors.text} font-semibold`}>Available Courses</h3>
          </div>
          <span className={`${colors.secondaryText} text-sm`}>{availableCourses.length} courses with open enrollment</span>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${availableCourses.length === 0 ? 'items-center justify-center' : ''}`}>
          {availableCourses.length > 0 ? (
            availableCourses.slice(0, 3).map((course, index) => (
              <div key={index} className={`${theme === 'dark' ? 'bg-[#1E2733]/30' : 'bg-gray-50'} p-3 rounded-lg border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
                  <h4 className={`${colors.text} font-medium text-sm`}>{course.name}</h4>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${colors.secondaryText} text-xs`}>{course.departmentCode} | {course.code}</span>
                  <span className={`${theme === 'dark' ? 'bg-[#121A22]/70' : 'bg-white'} px-2 py-1 rounded text-xs ${colors.text}`}>
                    {course.students}/{course.maxCapacity} students
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6">
              <span className={`${colors.secondaryText}`}>No available courses at the moment</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Course List (Limited to 8) */}
        <div className="w-full lg:w-1/2">
          <div className={`${colors.card} p-4 rounded-xl`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Book size={18} className={colors.icon} />
                <h3 className={`${colors.text} font-semibold`}>Course Overview</h3>
              </div>
              <span className={`${colors.secondaryText} text-sm`}>Showing {displayCourses.length} of {processedCourseData.length}</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayCourses.map((course, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1E2733]/30' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
                      <h4 className={`${colors.text} font-medium`}>{course.name}</h4>
                    </div>
                    <span className={`${course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-full`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className={`${colors.secondaryText} text-xs`}>Code:</span>
                      <span className={`${colors.text} ml-1`}>{course.code}</span>
                    </div>
                    <div>
                      <span className={`${colors.secondaryText} text-xs`}>Dept:</span>
                      <span className={`${colors.text} ml-1`}>{course.departmentCode}</span>
                    </div>
                    <div>
                      <span className={`${colors.secondaryText} text-xs`}>Students:</span>
                      <span className={`${colors.text} ml-1`}>{course.students}/{course.maxCapacity}</span>
                    </div>
                    <div>
                      <span className={`${colors.secondaryText} text-xs`}>Credits:</span>
                      <span className={`${colors.text} ml-1`}>{course.credits}</span>
                    </div>
                  </div>
                  
                  {/* Fixed the progress bars */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ 
                        width: `${Math.min((course.students / Math.max(course.maxCapacity, 1)) * 100, 100)}%`,
                        minWidth: course.students > 0 ? '5%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Charts Section - Fixed */}
        <div className="w-full lg:w-1/2">
          <DepartmentDistributionChart coursesData={processedCourseData} />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          onClick={handleNavigateToCourseInfo} 
          className={`flex items-center gap-2 ${colors.button.primary} py-2 px-4 rounded-lg text-sm font-medium`}
        >
          Manage All Courses
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { useTheme } from '../../../context/ThemeProvider';
// import { Book, ChevronRight, Users, Award, Building } from 'lucide-react';
// import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import SectionHeader from './commonComponents/SectionHeader';
// import { useNavigate } from 'react-router-dom';

// // Function to generate consistent colors based on department or course name
// const generateColor = (text) => {
//   const colors = [
//     '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
//     '#98D8C8', '#F78FB3', '#3498DB', '#F1C40F', 
//     '#9B59B6', '#2ECC71', '#E74C3C', '#1ABC9C'
//   ];
  
//   // Simple hash function to get consistent color for same text
//   const charSum = text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
//   return colors[charSum % colors.length];
// };

// export default function CourseDistributionSection({ coursesData }) {
//   const { themeConfig, theme } = useTheme();
//   const colors = themeConfig[theme];
//   const navigate = useNavigate();
  
//   // Process the courses data for chart display
//   const processedCourseData = coursesData.map(course => ({
//     id: course._id,
//     name: course.courseName,
//     code: course.courseCode,
//     students: course.enrolledStudents.length,
//     maxCapacity: course.maxCapacity,
//     department: course.department?.name || 'Unknown Department',
//     coordinator: course.courseCoordinator || 'Not Assigned',
//     academicYear: course.academicYear,
//     semester: course.semester,
//     description: course.courseDescription,
//     credits: course.credits,
//     color: generateColor(course.department?.name || course.courseName)
//   }));
  
//   const [selectedCourse, setSelectedCourse] = useState(processedCourseData[0]);
  
//   const handleNavigateToCourseInfo = () => {
//     navigate('/admin/manageCourses');
//   };

//   // Calculate total enrolled students
//   const totalEnrolledStudents = processedCourseData.reduce((total, course) => total + course.students, 0);
  
//   // Calculate total capacity
//   const totalCapacity = processedCourseData.reduce((total, course) => total + course.maxCapacity, 0);
  
//   // Calculate enrollment percentage
//   const enrollmentPercentage = totalCapacity > 0 
//     ? Math.round((totalEnrolledStudents / totalCapacity) * 100) 
//     : 0;

//   return (
//     <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 mb-10 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
//       <SectionHeader 
//         title="Course Distribution" 
//         subtitle="Distribution of students across different courses"
//       />
      
//       <div className="flex flex-col lg:flex-row items-center justify-between">
//         <div className="w-full lg:w-2/5">
//           <div className={`${colors.card} p-6 rounded-xl mb-4`}>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//                   <Book size={20} className={colors.icon} />
//                 </div>
//                 <div>
//                   <h3 className={`${colors.secondaryText} text-sm`}>Total Courses</h3>
//                   <h2 className={`${colors.text} text-2xl font-bold`}>{processedCourseData.length}</h2>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//                   <Users size={20} className={colors.icon} />
//                 </div>
//                 <div>
//                   <h3 className={`${colors.secondaryText} text-sm`}>Enrollment</h3>
//                   <h2 className={`${colors.text} text-2xl font-bold`}>{enrollmentPercentage}%</h2>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-4 max-h-64 overflow-y-auto">
//               {processedCourseData.map((course, index) => (
//                 <div 
//                   key={index} 
//                   className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
//                     selectedCourse && selectedCourse.id === course.id 
//                       ? theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-blue-100'
//                       : ''
//                   }`}
//                   onClick={() => setSelectedCourse(course)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
//                     <span className={`${colors.text} text-sm`}>{course.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className={`${colors.secondaryText} text-sm font-medium`}>{course.students}</span>
//                     <span className={`${colors.secondaryText} text-xs`}>/{course.maxCapacity}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
        
//         <div className="w-full lg:w-3/5 mt-6 lg:mt-0 flex flex-col items-center">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={processedCourseData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={5}
//                 dataKey="students"
//                 nameKey="name"
//               >
//                 {processedCourseData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 formatter={(value, _name, props) => [
//                   `${value} students (${Math.round((value / props.payload.maxCapacity) * 100)}% filled)`, 
//                   props.payload.name
//                 ]}
//                 contentStyle={{ 
//                   backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                   borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
//                   color: theme === 'dark' ? '#fff' : '#333'
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
          
//           {selectedCourse && (
//             <div className={`${colors.card} p-4 rounded-xl w-full mt-4`}>
//               <h3 className={`${colors.text} font-semibold border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pb-2`}>
//                 {selectedCourse.name} ({selectedCourse.code})
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//                 <div className="flex items-center gap-2">
//                   <Building size={16} className={colors.icon} />
//                   <span className={`${colors.secondaryText} text-sm`}>Department: </span>
//                   <span className={`${colors.text} text-sm font-medium`}>{selectedCourse.department}</span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <Award size={16} className={colors.icon} />
//                   <span className={`${colors.secondaryText} text-sm`}>Credits: </span>
//                   <span className={`${colors.text} text-sm font-medium`}>{selectedCourse.credits}</span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className={colors.icon} />
//                   <span className={`${colors.secondaryText} text-sm`}>Enrollment: </span>
//                   <span className={`${colors.text} text-sm font-medium`}>
//                     {selectedCourse.students}/{selectedCourse.maxCapacity} 
//                     ({Math.round((selectedCourse.students / selectedCourse.maxCapacity) * 100)}%)
//                   </span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <Book size={16} className={colors.icon} />
//                   <span className={`${colors.secondaryText} text-sm`}>{selectedCourse.semester} {selectedCourse.academicYear}</span>
//                 </div>
//               </div>
              
//               <p className={`${colors.secondaryText} text-sm mt-3`}>
//                 {selectedCourse.description || "No description available."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="flex justify-end mt-4">
//         <button 
//           onClick={handleNavigateToCourseInfo} 
//           className={`flex items-center gap-2 ${colors.button.primary} py-2 px-4 rounded-lg text-sm font-medium`}
//         >
//           View Course Details
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }