// mockData.js - Mock data for the student management system

// Mock student data
export const mockStudents = [
    { 
      id: 1, 
      firstName: "Alex", 
      lastName: "Johnson", 
      email: "alex@example.com", 
      rollNumber: "S2025001", 
      course: "Web Development", 
      group: "Group A", 
      admissionYear: 2025,
      enrollmentDate: "2025-01-15", 
      attendance: 87, 
      status: "Active" 
    },
    { 
      id: 2, 
      firstName: "Maria", 
      lastName: "Garcia", 
      email: "maria@example.com", 
      rollNumber: "S2025002", 
      course: "Data Science", 
      group: "Group C", 
      admissionYear: 2025,
      enrollmentDate: "2025-02-03", 
      attendance: 94, 
      status: "Active" 
    },
    { 
      id: 3, 
      firstName: "James", 
      lastName: "Smith", 
      email: "james@example.com", 
      rollNumber: "S2025003", 
      course: "UX Design", 
      group: "Group B", 
      admissionYear: 2025,
      enrollmentDate: "2025-01-20", 
      attendance: 62, 
      status: "On Leave" 
    },
    { 
      id: 4, 
      firstName: "Emily", 
      lastName: "Chen", 
      email: "emily@example.com", 
      rollNumber: "S2025004", 
      course: "Web Development", 
      group: "Group A", 
      admissionYear: 2025,
      enrollmentDate: "2025-02-10", 
      attendance: 91, 
      status: "Active" 
    },
    { 
      id: 5, 
      firstName: "Michael", 
      lastName: "Brown", 
      email: "michael@example.com", 
      rollNumber: "S2025005", 
      course: "Mobile App Dev", 
      group: "Group D", 
      admissionYear: 2025,
      enrollmentDate: "2025-01-08", 
      attendance: 45, 
      status: "Inactive" 
    },
    // Additional mock data to demonstrate pagination
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 6,
      firstName: `Student${i+6}`,
      lastName: `Last${i+6}`,
      email: `student${i+6}@example.com`,
      rollNumber: `S2025${String(i+6).padStart(3, '0')}`,
      course: i % 3 === 0 ? "Web Development" : i % 3 === 1 ? "Data Science" : "UX Design",
      group: i % 4 === 0 ? "Group A" : i % 4 === 1 ? "Group B" : i % 4 === 2 ? "Group C" : "Group D",
      admissionYear: 2025,
      enrollmentDate: "2025-01-15",
      attendance: Math.floor(Math.random() * 100),
      status: i % 5 === 0 ? "Inactive" : i % 10 === 0 ? "On Leave" : "Active"
    }))
  ];
  
  // Mock teacher data
  export const mockTeachers = [
    { 
      id: 1, 
      firstName: "Sarah", 
      lastName: "Wilson", 
      email: "sarah@example.com", 
      employeeId: "T1001", 
      department: "Computer Science", 
      courses: ["Web Development", "Mobile App Dev"], 
      joinDate: "2024-05-12", 
      status: "Active" 
    },
    { 
      id: 2, 
      firstName: "Robert", 
      lastName: "Lee", 
      email: "robert@example.com", 
      employeeId: "T1002", 
      department: "Data Analytics", 
      courses: ["Data Science", "Machine Learning"], 
      joinDate: "2023-11-20", 
      status: "Active" 
    },
    { 
      id: 3, 
      firstName: "Lisa", 
      lastName: "Patel", 
      email: "lisa@example.com", 
      employeeId: "T1003", 
      department: "Design", 
      courses: ["UX Design", "UI Fundamentals"], 
      joinDate: "2024-01-15", 
      status: "On Leave" 
    },
    { 
      id: 4, 
      firstName: "David", 
      lastName: "Kim", 
      email: "david@example.com", 
      employeeId: "T1004", 
      department: "Computer Science", 
      courses: ["Programming Basics"], 
      joinDate: "2023-08-05", 
      status: "Active" 
    },
  ];
  
  // Helper functions to get unique values from data
  export const getUniqueCourses = () => {
    return [...new Set(mockStudents.map(student => student.course))];
  };
  
  export const getUniqueGroups = (courseName = null) => {
    if (courseName) {
      return [...new Set(mockStudents
        .filter(s => s.course === courseName)
        .map(s => s.group))];
    }
    return [...new Set(mockStudents.map(s => s.group))];
  };
  
  export const getUniqueDepartments = () => {
    return [...new Set(mockTeachers.map(teacher => teacher.department))];
  };
  
  // Filter functions
  export const filterStudents = ({ searchTerm = '', course = '', group = '' }) => {
    return mockStudents.filter(student => {
      const matchesSearch = searchTerm === '' || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = course === '' || student.course === course;
      const matchesGroup = group === '' || student.group === group;
      
      return matchesSearch && matchesCourse && matchesGroup;
    });
  };
  
  export const filterTeachers = ({ searchTerm = '', department = '' }) => {
    return mockTeachers.filter(teacher => {
      const matchesSearch = searchTerm === '' || 
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = department === '' || teacher.department === department;
      
      return matchesSearch && matchesDepartment;
    });
  };