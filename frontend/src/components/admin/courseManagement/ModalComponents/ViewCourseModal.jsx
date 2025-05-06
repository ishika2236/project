import React from 'react';
import { Edit, User, Book, Calendar, Award } from 'lucide-react';

const ViewCourseModal = ({ isOpen, onClose, course, onEditClick, colors }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.card} rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-4 border-b border-gray-700 ${colors.cardHeader} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${colors.text}`}>{course.courseName}</h2>
          <div className="flex items-center">
            <button 
              onClick={onEditClick}
              className={`flex items-center py-1 px-3 rounded-lg mr-2 ${colors.button.blue}`}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={onClose}
              className="flex items-center py-1 px-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Course Details */}
          <div className={`${colors.cardAccent} p-4 rounded-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Course Code</p>
                <p className={`${colors.text} font-semibold`}>{course.courseCode}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Department</p>
                <p className={`${colors.text} font-semibold`}>{course.department?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Academic Year</p>
                <p className={`${colors.text} font-semibold`}>{course.academicYear}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Semester</p>
                <p className={`${colors.text} font-semibold`}>{course.semester}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Credits</p>
                <p className={`${colors.text} font-semibold`}>{course.credits}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Max Capacity</p>
                <p className={`${colors.text} font-semibold`}>{course.maxCapacity}</p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Status</p>
                <p className={`${course.isActive ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div>
                <p className={`${colors.secondaryText} text-sm`}>Course Coordinator</p>
                <p className={`${colors.text} font-semibold`}>
                  {course.courseCoordinator?.name || 'Not Assigned'}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className={`${colors.secondaryText} text-sm mb-1`}>Course Description</p>
              <p className={`${colors.text}`}>{course.courseDescription}</p>
            </div>
          </div>
          
          {/* Additional sections like enrolled students, teaching staff, etc. can be added here */}
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal;