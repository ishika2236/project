// Mock data for dashboard visualization
// dashboardData.js

// Basic student data
export const studentData = {
    total: 856,
    newThisMonth: 48,
    growth: 12.5,
    sections: [
      { name: 'Computer Science', students: 320, color: '#2E67FF' },
      { name: 'Data Science', students: 280, color: '#2F955A' },
      { name: 'Digital Marketing', students: 156, color: '#F2683C' },
      { name: 'Graphic Design', students: 100, color: '#506EE5' }
    ]
  };
  
  // Course level data
  export const courseData = {
    total: 24,
    sections: [
      { name: 'Web Development', students: 210, color: '#2E67FF' },
      { name: 'AI & Machine Learning', students: 185, color: '#2F955A' },
      { name: 'UI/UX Design', students: 130, color: '#F2683C' },
      { name: 'Digital Marketing', students: 120, color: '#506EE5' },
      { name: 'Others', students: 211, color: '#8884d8' }
    ]
  };
  
  // Enhanced course and group data
  export const courseGroupData = [
    { 
      name: 'Web Development',
      totalGroups: 7,
      students: 210,
      color: '#2E67FF',
      groups: [
        { name: 'Group A', students: 30 },
        { name: 'Group B', students: 32 },
        { name: 'Group C', students: 29 },
        { name: 'Group D', students: 30 },
        { name: 'Group E', students: 31 },
        { name: 'Group F', students: 28 },
        { name: 'Group G', students: 30 }
      ]
    },
    { 
      name: 'AI & Machine Learning',
      totalGroups: 6,
      students: 185,
      color: '#2F955A',
      groups: [
        { name: 'Group A', students: 32 },
        { name: 'Group B', students: 30 },
        { name: 'Group C', students: 31 },
        { name: 'Group D', students: 32 },
        { name: 'Group E', students: 30 },
        { name: 'Group F', students: 30 }
      ]
    },
    { 
      name: 'UI/UX Design',
      totalGroups: 3,
      students: 130,
      color: '#F2683C',
      groups: [
        { name: 'Group A', students: 45 },
        { name: 'Group B', students: 42 },
        { name: 'Group C', students: 43 }
      ]
    },
    { 
      name: 'Digital Marketing',
      totalGroups: 2,
      students: 120,
      color: '#506EE5',
      groups: [
        { name: 'Group A', students: 58 },
        { name: 'Group B', students: 62 }
      ]
    },
    { 
      name: 'Blockchain',
      totalGroups: 2,
      students: 65,
      color: '#8884d8',
      groups: [
        { name: 'Group A', students: 32 },
        { name: 'Group B', students: 33 }
      ]
    },
    { 
      name: 'Game Development',
      totalGroups: 3,
      students: 86,
      color: '#82ca9d',
      groups: [
        { name: 'Group A', students: 28 },
        { name: 'Group B', students: 30 },
        { name: 'Group C', students: 28 }
      ]
    },
    { 
      name: 'Cybersecurity',
      totalGroups: 2,
      students: 60,
      color: '#ffc658',
      groups: [
        { name: 'Group A', students: 30 },
        { name: 'Group B', students: 30 }
      ]
    }
  ];
  
  // Treemap data preparation
  export const treemapData = courseGroupData.map(course => ({
    name: course.name,
    size: course.students,
    color: course.color,
    children: course.groups.map(group => ({
      name: `${group.name} (${group.students})`,
      size: group.students,
      color: course.color
    }))
  }));
  
  // Processed treemap data for visualization
  export const processedTreemapData = {
    name: 'Courses',
    children: treemapData
  };
  
  // Attendance data for courses
  export const attendanceData = [
    { name: 'Web Dev', attendance: 88 },
    { name: 'AI/ML', attendance: 76 },
    { name: 'UI/UX', attendance: 92 },
    { name: 'Digital', attendance: 68 },
    { name: 'Others', attendance: 79 }
  ];
  
  // Attendance data for groups
  export const groupAttendanceData = [
    { name: 'Group A', attendance: 93 },
    { name: 'Group B', attendance: 78 },
    { name: 'Group C', attendance: 85 },
    { name: 'Group D', attendance: 67 },
    { name: 'Group E', attendance: 89 }
  ];