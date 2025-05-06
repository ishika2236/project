// StudentsView.jsx (Complete)
import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { 
  StatusBadge, 
  AttendanceIndicator, 
  Pagination, 
  UserAvatar, 
  UserInfo 
} from './CommonComponents';

const StudentsView = ({
  currentStudents,
  filteredStudents,
  selectedCourse,
  selectedGroup,
  currentPage,
  itemsPerPage,
  totalPages,
  paginate,
  navigateToStudentRecord,
  theme,
  currentTheme,
}) => {
  {console.log(currentStudents)}
  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} rounded-xl overflow-hidden`}>
        {/* Students table */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className={currentTheme.text} size={20} />
              <h2 className={`text-lg font-semibold ${currentTheme.text}`}>
                Students {selectedCourse ? `- ${selectedCourse}` : ''}
                {selectedGroup ? ` (${selectedGroup})` : ''}
              </h2>
            </div>
            
            <div className={`text-sm ${currentTheme.secondaryText}`}>
              Showing {Math.min(filteredStudents.length, currentPage * itemsPerPage) - (currentPage - 1) * itemsPerPage} of {filteredStudents.length} students
            </div>
          </div>
          
          <div className={`rounded-lg overflow-hidden border ${
            theme === 'dark' ? 'border-[#1E2733]/50' : 'border-[#BDC3C7]/30'
          }`}>
            {/* Table Header */}
            <div className={`grid grid-cols-12 gap-4 px-4 py-3 ${
              theme === 'dark' ? 'bg-[#0A0E13] border-b border-[#1E2733]/30' : 'bg-gray-50 border-b border-[#BDC3C7]/30'
            } ${currentTheme.secondaryText} text-xs uppercase tracking-wider`}>
              <div className="col-span-3">Student</div>
              <div className="col-span-2">Roll Number</div>
              {!selectedCourse && <div className="col-span-2">Course</div>}
              {!selectedGroup && <div className="col-span-1">Group</div>}
              <div className={`col-span-${selectedCourse && selectedGroup ? 4 : (selectedCourse || selectedGroup) ? 3 : 2}`}>Attendance</div>
              <div className="col-span-2">Status</div>
            </div>
            
            {/* Table Body */}
            {currentStudents.length === 0 ? (
              <div className={`p-8 text-center ${currentTheme.secondaryText}`}>
                No students found matching your filters.
              </div>
            ) : (
              currentStudents.map(student => (
                <StudentRow 
                  key={student.id} 
                  student={student}
                  selectedCourse={selectedCourse}
                  selectedGroup={selectedGroup}
                  navigateToStudentRecord={navigateToStudentRecord}
                  theme={theme}
                  currentTheme={currentTheme}
                />
              ))
            )}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            theme={theme}
            currentTheme={currentTheme}
          />
        </div>
      </div>
    </div>
  );
};

// Student row component
const StudentRow = ({ 
  student, 
  selectedCourse, 
  selectedGroup, 
  navigateToStudentRecord, 
  theme, 
  currentTheme 
}) => {
  return (
    <div 
      className={`grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-b-0 ${
        theme === 'dark' ? 'border-[#1E2733]/30 hover:bg-[#121A22]/30' : 'border-[#BDC3C7]/30 hover:bg-gray-50'
      }`}
    >
      <div className="col-span-3 flex items-center gap-3">
        <UserAvatar 
          firstName={student.firstName} 
          theme={theme} 
          currentTheme={currentTheme} 
        />
        <UserInfo 
          firstName={student.firstName} 
          lastName={student.lastName} 
          email={student.email} 
          currentTheme={currentTheme} 
        />
      </div>
      <div className={`col-span-2 ${currentTheme.text} flex items-center`}>
        {student.rollNumber}
      </div>
      {!selectedCourse && (
        <div className={`col-span-2 ${currentTheme.text} flex items-center`}>
          {student.course}
        </div>
      )}
      {!selectedGroup && (
        <div className={`col-span-1 ${currentTheme.text} flex items-center`}>
          {student.group.name}
        </div>
      )}
      <div className={`col-span-${selectedCourse && selectedGroup ? 4 : (selectedCourse || selectedGroup) ? 3 : 2} flex items-center`}>
        <div className="flex-1">
          <AttendanceIndicator 
            percentage={student.attendance} 
            theme={theme} 
            currentTheme={currentTheme} 
          />
        </div>
        <button 
          onClick={() => navigateToStudentRecord(student.id)}
          className={`ml-2 p-1 rounded-md ${
            theme === 'dark' 
              ? 'bg-[#121A22] hover:bg-[#1E2733] text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          title="View attendance record"
        >
          <Calendar size={16} />
        </button>
      </div>
      <div className="col-span-2 flex items-center">
        <StatusBadge status={student.status} />
      </div>
    </div>
  );
};

export default StudentsView;