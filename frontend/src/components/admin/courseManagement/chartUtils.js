// Generate generic distribution data
const generateDistribution = (items, keyExtractor) => {
  const distribution = {};
  items.forEach(item => {
    const key = keyExtractor(item);
    if (!key) return;
    if (!distribution[key]) distribution[key] = 0;
    distribution[key]++;
  });
  return Object.entries(distribution).map(([name, count]) => ({ name, count }));
};

// Grade distribution data for charts
export const getGradeDistribution = (course) => {
  if (!course || !Array.isArray(course.enrolledStudents)) {
    return [];
  }
  return generateDistribution(course.enrolledStudents, student => student.grade);
};

// Department distribution data for charts
export const getDepartmentDistribution = (courses) => {
  if (!Array.isArray(courses)) {
    return [];
  }
  return generateDistribution(courses, course => course.department?.name || "Unknown");
};

// Enrollment trend data (static example)
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
