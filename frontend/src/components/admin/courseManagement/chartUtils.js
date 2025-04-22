
// Grade distribution data for charts
export const getGradeDistribution = (course) => {
    // Handle undefined or missing course
    if (!course || !course.enrolledStudents) {
      return [];
    }
    
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0, IP: 0 };
    course.enrolledStudents.forEach(student => {
      distribution[student.grade]++;
    });
    return Object.keys(distribution).map(grade => ({ name: grade, count: distribution[grade] }));
  };
  
  // Department distribution data
  export const getDepartmentDistribution = (courses) => {
    const distribution = {};
    courses.forEach(course => {
      if (!distribution[course.department]) {
        distribution[course.department] = 0;
      }
      distribution[course.department]++;
    });
    return Object.keys(distribution).map(dept => ({ name: dept, count: distribution[dept] }));
  };
  
  // Enrollment trend data
  export const getEnrollmentTrend = () => {
    return [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 140 },
      { month: 'Mar', count: 160 },
      { month: 'Apr', count: 180 },
      { month: 'May', count: 190 },
      { month: 'Jun', count: 170 }
    ];
  };