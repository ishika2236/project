// TeachersView.jsx
import React from 'react';
import { UserCircle } from 'lucide-react';
import { StatusBadge, Pagination, UserAvatar, UserInfo } from './CommonComponents';

const TeachersView = ({
  currentTeachers,
  filteredTeachers,
  currentPage,
  itemsPerPage,
  totalPages,
  paginate,
  theme,
  currentTheme,
}) => {
  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} rounded-xl overflow-hidden`}>
        {/* Teachers table */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCircle className={currentTheme.text} size={20} />
              <h2 className={`text-lg font-semibold ${currentTheme.text}`}>
                Teachers
              </h2>
            </div>
            
            <div className={`text-sm ${currentTheme.secondaryText}`}>
              Showing {Math.min(filteredTeachers.length, currentPage * itemsPerPage) - (currentPage - 1) * itemsPerPage} of {filteredTeachers.length} teachers
            </div>
          </div>
          
          <div className={`rounded-lg overflow-hidden border ${
            theme === 'dark' ? 'border-[#1E2733]/50' : 'border-[#BDC3C7]/30'
          }`}>
            {/* Table Header */}
            <div className={`grid grid-cols-12 gap-4 px-4 py-3 ${
              theme === 'dark' ? 'bg-[#0A0E13] border-b border-[#1E2733]/30' : 'bg-gray-50 border-b border-[#BDC3C7]/30'
            } ${currentTheme.secondaryText} text-xs uppercase tracking-wider`}>
              <div className="col-span-3">Teacher</div>
              <div className="col-span-2">Employee ID</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-2">Courses</div>
              <div className="col-span-2">Status</div>
            </div>
            
            {/* Table Body */}
            {currentTeachers.length === 0 ? (
              <div className={`p-8 text-center ${currentTheme.secondaryText}`}>
                No teachers found matching your filters.
              </div>
            ) : (
              currentTeachers.map(teacher => (
                <TeacherRow 
                  key={teacher.id} 
                  teacher={teacher}
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

// Teacher row component
const TeacherRow = ({ 
  teacher, 
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
          firstName={teacher.firstName} 
          theme={theme} 
          currentTheme={currentTheme} 
        />
        <UserInfo 
          firstName={teacher.firstName} 
          lastName={teacher.lastName} 
          email={teacher.email} 
          currentTheme={currentTheme} 
        />
      </div>
      <div className={`col-span-2 ${currentTheme.text} flex items-center`}>
        {teacher.employeeId}
      </div>
      <div className={`col-span-3 ${currentTheme.text} flex items-center`}>
        {teacher.department}
      </div>
      <div className={`col-span-2 ${currentTheme.text} flex items-center`}>
        {teacher.courses.join(', ')}
      </div>
      <div className="col-span-2 flex items-center">
        <StatusBadge status={teacher.status} />
      </div>
    </div>
  );
};

export default TeachersView;