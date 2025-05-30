/**
 * Chart utility functions for processing course data into chart-ready formats
 */

/**
 * Process course grade data to create a distribution chart
 * @param {Object} course - Course object containing grade information
 * @returns {Array} Array of grade distribution data
 */
export const getGradeDistribution = (course) => {
    // This would normally process real grade data from the course
    // Since we don't have actual grade data in the provided course structure,
    // we'll create sample data for visualization purposes
    
    return [
      { name: 'A', count: 35 },
      { name: 'B', count: 25 },
      { name: 'C', count: 20 },
      { name: 'D', count: 12 },
      { name: 'F', count: 8 }
    ];
  };
  
  /**
   * Process courses by department to create a distribution chart
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of department distribution data
   */
  export const getDepartmentDistribution = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
  
    // Count courses by department
    const departments = {};
    
    courses.forEach(course => {
      if (course.department && course.department.name) {
        const deptName = course.department.name;
        departments[deptName] = (departments[deptName] || 0) + 1;
      } else if (course.courseCode) {
        // If department object is missing, try to extract from course code
        const deptCode = course.courseCode.split(/\d/)[0];
        if (deptCode) {
          departments[deptCode] = (departments[deptCode] || 0) + 1;
        }
      }
    });
    
    // Convert to array format for charts
    return Object.keys(departments).map(name => ({
      name,
      count: departments[name]
    }));
  };
  
  /**
   * Generate enrollment trend data
   * @returns {Array} Array of enrollment data by month
   */
  export const getEnrollmentTrend = () => {
    // Sample data showing an enrollment trend over the academic year
    return [
      { month: 'Aug', count: 125 },
      { month: 'Sep', count: 250 },
      { month: 'Oct', count: 300 },
      { month: 'Nov', count: 310 },
      { month: 'Dec', count: 290 },
      { month: 'Jan', count: 350 },
      { month: 'Feb', count: 380 },
      { month: 'Mar', count: 400 },
      { month: 'Apr', count: 390 },
      { month: 'May', count: 370 }
    ];
  };
  
  /**
   * Get course status distribution data
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of status distribution data
   */
  export const getCourseStatusDistribution = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
    
    let active = 0;
    let inactive = 0;
    
    courses.forEach(course => {
      if (course.isActive) {
        active++;
      } else {
        inactive++;
      }
    });
    
    return [
      { name: 'Active', value: active },
      { name: 'Inactive', value: inactive }
    ];
  };
  
  /**
   * Get course capacity utilization data
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of capacity utilization data
   */
  export const getCourseCapacityData = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
    
    return courses.map(course => {
      const enrolledCount = course.enrolledStudents ? course.enrolledStudents.length : 0;
      const capacityPercentage = course.maxCapacity ? 
        Math.round((enrolledCount / course.maxCapacity) * 100) : 0;
      
      return {
        name: course.courseCode,
        capacity: course.maxCapacity || 0,
        enrolled: enrolledCount,
        utilizationPercentage: capacityPercentage
      };
    }).slice(0, 5); // Limit to top 5 courses for readability
  };
  
  /**
   * Get instructor assignment distribution
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of instructor course load data
   */
  export const getInstructorDistribution = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
    
    const instructorMap = {};
    
    courses.forEach(course => {
      if (course.instructors && Array.isArray(course.instructors)) {
        course.instructors.forEach(instructor => {
          const name = instructor.firstName && instructor.lastName ? 
            `${instructor.firstName} ${instructor.lastName}` : 
            instructor.email || 'Unknown';
            
          instructorMap[name] = (instructorMap[name] || 0) + 1;
        });
      }
    });
    
    // Convert to array format for charts
    return Object.keys(instructorMap)
      .map(name => ({
        name: name.length > 15 ? `${name.substring(0, 12)}...` : name,
        courses: instructorMap[name]
      }))
      .sort((a, b) => b.courses - a.courses)
      .slice(0, 5); // Limit to top 5 instructors
  };
  
  /**
   * Get credits distribution across courses
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of credits distribution data
   */
  export const getCreditsDistribution = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
    
    const creditsMap = {};
    
    courses.forEach(course => {
      if (course.credits) {
        const creditValue = course.credits.toString();
        creditsMap[creditValue] = (creditsMap[creditValue] || 0) + 1;
      }
    });
    
    return Object.keys(creditsMap)
      .map(credits => ({
        credits: parseInt(credits),
        count: creditsMap[credits]
      }))
      .sort((a, b) => a.credits - b.credits);
  };
  
  /**
   * Get semester distribution
   * @param {Array} courses - Array of course objects
   * @returns {Array} Array of semester distribution data
   */
  export const getSemesterDistribution = (courses) => {
    if (!courses || courses.length === 0) {
      return [];
    }
    
    const semesterMap = {};
    
    courses.forEach(course => {
      if (course.semester) {
        semesterMap[course.semester] = (semesterMap[course.semester] || 0) + 1;
      }
    });
    
    return Object.keys(semesterMap).map(name => ({
      name,
      count: semesterMap[name]
    }));
  };