import React from 'react';
import { useSelector } from 'react-redux';
import { Users, BookOpen, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentDetails = ({ 
  departmentId, 
  theme, 
  currentTheme,
  departmentCourses = [], 
  departmentGroups = []   
}) => {
  const { currentDepartment } = useSelector(state => state.departments);
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#0A0E13]/50' : 'bg-gray-50'} p-4 border-t ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-100'}`}>
      {currentDepartment && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center mb-4">
            <h4 className={`${currentTheme.text} font-medium mr-4`}>Department Head:</h4>
            <div className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'} px-3 py-1 rounded-md flex items-center`}>
              <User size={16} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
              <span>{currentDepartment.departmentHead?.name || 'Not Assigned'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center">
            <h4 className={`${currentTheme.text} font-medium mr-4`}>Established:</h4>
            <div className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'} px-3 py-1 rounded-md flex items-center`}>
              <Calendar size={16} className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mr-2`} />
              <span>{new Date(currentDepartment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Groups Preview */}
        <div>
          <h4 className={`${currentTheme.text} font-medium mb-2 flex items-center`}>
            <Users size={16} className="mr-2" />
            Groups
          </h4>
          <div className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'} border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'} rounded-lg overflow-hidden`}>
            {departmentGroups && departmentGroups.length > 0 ? (
              departmentGroups.slice(0, 3).map((group, index) => (
                <div 
                  key={group._id} 
                  className={`p-3 ${index !== departmentGroups.slice(0, 3).length - 1 ? `${theme === 'dark' ? 'border-b border-[#1E2733]' : 'border-b border-gray-200'}` : ''}`}
                >
                  <div className="flex justify-between">
                    <span className={`${currentTheme.text} font-medium`}>{group.name}</span>
                    <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {group.students?.length || 0} students
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className={currentTheme.secondaryText}>No groups available</p>
              </div>
            )}
          </div>
          <div className="mt-2 text-right">
            <Link to={`/departments/${departmentId}/groups`} className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              View All Groups
            </Link>
          </div>
        </div>
        
        {/* Courses Preview */}
        <div>
          <h4 className={`${currentTheme.text} font-medium mb-2 flex items-center`}>
            <BookOpen size={16} className="mr-2" />
            Courses
          </h4>
          <div className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'} border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'} rounded-lg overflow-hidden`}>
            {departmentCourses && departmentCourses.length > 0 ? (
              departmentCourses.slice(0, 3).map((course, index) => (
                <div 
                  key={course._id}
                  className={`p-3 ${index !== departmentCourses.slice(0, 3).length - 1 ? `${theme === 'dark' ? 'border-b border-[#1E2733]' : 'border-b border-gray-200'}` : ''}`}
                >
                  <div className="flex justify-between">
                    <span className={`${currentTheme.text} font-medium`}>{course.name}</span>
                    <span className={`${course.active ? `${theme === 'dark' ? 'text-green-400' : 'text-green-600'}` : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}`}>
                      {course.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className={currentTheme.secondaryText}>No courses available</p>
              </div>
            )}
          </div>
          <div className="mt-2 text-right">
            <Link to={`/departments/${departmentId}/courses`} className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              View All Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;