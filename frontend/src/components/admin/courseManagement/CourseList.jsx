// CourseList.js
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit2, Trash2 } from 'lucide-react';

const CourseCard = ({ course, onView, onEdit, onDelete, colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`${colors.card} rounded-lg overflow-hidden mb-4`}>
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer`}
        onClick={toggleExpand}
      >
        <div>
          <h3 className={`font-medium ${colors.text}`}>
            {course.courseCode}: {course.courseName}
          </h3>
          <p className={`text-sm ${colors.secondaryText}`}>
            {course.department} • {course.credits} credits • {course.enrolledStudents.length}/{course.maxCapacity} students
          </p>
        </div>
        <div className="flex items-center">
          <div className={`px-2 py-1 rounded-full text-xs mr-2 ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {course.isActive ? 'Active' : 'Inactive'}
          </div>
          {isExpanded ? 
            <ChevronUp className={`h-5 w-5 ${colors.icon}`} /> : 
            <ChevronDown className={`h-5 w-5 ${colors.icon}`} />
          }
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          <p className={`mb-4 ${colors.secondaryText}`}>{course.courseDescription}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className={`text-sm font-medium mb-1 ${colors.gradient.text}`}>Course Details</h4>
              <ul className={`space-y-1 ${colors.text}`}>
                <li>Academic Year: {course.academicYear}</li>
                <li>Semester: {course.semester}</li>
                <li>Coordinator: {course.courseCoordinator?.name}</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`text-sm font-medium mb-1 ${colors.gradient.text}`}>Instructors</h4>
              <ul className={`space-y-1 ${colors.text}`}>
                {course.instructors.map(instructor => (
                  <li key={instructor._id}>{instructor.name}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`flex items-center py-1 px-3 rounded-md ${colors.button.primary}`}
              onClick={(e) => {
                e.stopPropagation();
                onView(course);
              }}
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </button>
            
            <button 
              className={`flex items-center py-1 px-3 rounded-md ${colors.button.orange}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
            >
              <Edit2 className="mr-1 h-4 w-4" />
              Edit
            </button>
            
            <button 
              className="flex items-center py-1 px-3 rounded-md bg-red-500 text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course._id);
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseList = ({ courses, onView, onEdit, onDelete, colors }) => {
  return (
    <div className="mb-6">
      <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Courses ({courses.length})</h2>
      
      <div className="space-y-4">
        {courses.length === 0 ? (
          <p className={`p-4 ${colors.card} rounded-lg ${colors.secondaryText}`}>
            No courses found. Try adjusting your search or create a new course.
          </p>
        ) : (
          courses.map(course => (
            <CourseCard 
              key={course._id}
              course={course}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              colors={colors}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CourseList;