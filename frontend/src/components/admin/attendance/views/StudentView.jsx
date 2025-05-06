import React from 'react';
import StudentInfo from '../student/StudentInfo';
import AttendanceRecords from '../student/AttendanceRecords';
import LeaveSummary from '../student/LeaveSummary';
import AttendanceDistribution from '../student/AttendanceDistribution';

const StudentView = ({ student, courses, groups, departments, onApproveLeave }) => {
  // Get only the courses this student is enrolled in
  const studentCourses = courses.filter(course => student.courses.includes(course.id));
  
  // Get the student's department and group
  const department = departments.find(d => d.id === student.departmentId);
  const group = groups.find(g => g.id === student.groupId);

  return (
    <div>
      {/* Student Info */}
      <div className="mb-8">
        <StudentInfo 
          student={student} 
          courses={studentCourses} 
          group={group}
          department={department}
        />
      </div>
      
      {/* Attendance Records */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
        <AttendanceRecords 
          studentId={student.id}
          attendance={student.attendance}
          courses={courses}
          onApproveLeave={onApproveLeave}
        />
      </div>
      
      {/* Leave Summary & Attendance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaveSummary attendance={student.attendance} courses={courses} />
        <AttendanceDistribution attendance={student.attendance} courses={courses} />
      </div>
    </div>
  );
};

export default StudentView;