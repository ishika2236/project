import React from 'react';
import StudentInfo from '../student/StudentInfo';
import AttendanceRecords from '../student/AttendanceRecords';
import LeaveSummary from '../student/LeaveSummary';
import AttendanceDistribution from '../student/AttendanceDistribution';

const StudentView = ({ student, courses, groups, onApproveLeave }) => {
  return (
    <div>
      {/* Student Info */}
      <div className="mb-8">
        <StudentInfo 
          student={student} 
          courses={courses} 
          groups={groups} 
        />
      </div>
      
      {/* Attendance Records */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
        <AttendanceRecords 
          studentId={student.id}
          attendance={student.attendance}
          onApproveLeave={onApproveLeave}
        />
      </div>
      
      {/* Leave Summary & Attendance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaveSummary attendance={student.attendance} />
        <AttendanceDistribution attendance={student.attendance} />
      </div>
    </div>
  );
};

export default StudentView;