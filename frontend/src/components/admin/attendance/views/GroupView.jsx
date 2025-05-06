import React from 'react';
import { Users, Clock } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';
import StudentTable from '../group/StudentTable';

const GroupView = ({ group, department, students, courses, searchTerm, onStudentSelect }) => {
  const { isDark } = useTheme();
  
  const filteredStudents = students.filter(student => 
    student.groupId === group.id && 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pendingLeaves = students.filter(s => 
    s.groupId === group.id && 
    s.attendance.some(a => (a.status === 'medical' || a.status === 'duty') && !a.approved)
  ).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{group.name} - {department.name} Department</h2>
        <div className="flex gap-2">
          <div className={`flex items-center px-3 py-1 rounded-md ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
            <Users size={16} className="mr-1" />
            {group.studentCount} Students
          </div>
          <div className={`flex items-center px-3 py-1 rounded-md ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
            <Clock size={16} className="mr-1" />
            {pendingLeaves} Pending Leaves
          </div>
        </div>
      </div>
      
      <StudentTable 
        students={filteredStudents} 
        onStudentSelect={onStudentSelect}
        courses={courses}
      />
    </div>
  );
};

export default GroupView;