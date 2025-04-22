import React from 'react';
import { X, Users, BookOpen, Edit2 } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { getGradeDistribution } from '../chartUtils';
const CHART_COLORS = ['#2E67FF', '#2F955A', '#F2683C', '#E9446A', '#8A2BE2', '#FFD700'];



const ViewCourseModal = ({ course, isOpen, onClose, onEditClick, colors }) => {
  if (!isOpen || !course) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.card} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className={`text-xl font-semibold ${colors.gradient.text}`}>{course.courseCode}: {course.courseName}</h2>
          <button 
            className={`${colors.icon} hover:text-gray-400`}
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <p className={`mb-6 ${colors.text}`}>{course.courseDescription}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`text-lg font-medium mb-3 ${colors.gradient.text}`}>Course Information</h3>
              <div className={`${colors.innerCard} p-4 rounded-lg`}>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Department:</span>
                    <span className={colors.text}>{course.department}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Academic Year:</span>
                    <span className={colors.text}>{course.academicYear}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Semester:</span>
                    <span className={colors.text}>{course.semester}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Credits:</span>
                    <span className={colors.text}>{course.credits}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Capacity:</span>
                    <span className={colors.text}>{course.enrolledStudents.length}/{course.maxCapacity}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className={colors.secondaryText}>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-3 ${colors.gradient.text}`}>Grade Distribution</h3>
              <div className={`${colors.innerCard} p-4 rounded-lg h-64`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getGradeDistribution(course)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2E67FF">
                      {getGradeDistribution(course).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <Users className={`h-5 w-5 mr-2 ${colors.icon}`} />
                <h3 className={`text-lg font-medium ${colors.gradient.text}`}>Instructors</h3>
              </div>
              <div className={`${colors.innerCard} p-4 rounded-lg`}>
                {course.instructors.length === 0 ? (
                  <p className={colors.secondaryText}>No instructors assigned.</p>
                ) : (
                  <ul className="space-y-2">
                    {course.instructors.map(instructor => (
                      <li key={instructor._id} className={`flex items-center ${colors.text}`}>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                          {instructor.name.charAt(0)}
                        </div>
                        {instructor.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <BookOpen className={`h-5 w-5 mr-2 ${colors.icon}`} />
                <h3 className={`text-lg font-medium ${colors.gradient.text}`}>Prerequisites</h3>
              </div>
              <div className={`${colors.innerCard} p-4 rounded-lg`}>
                {!course.prerequisites || course.prerequisites.length === 0 ? (
                  <p className={colors.secondaryText}>No prerequisites required.</p>
                ) : (
                  <ul className="space-y-2">
                    {course.prerequisites.map(prereq => (
                      <li key={prereq._id} className={colors.text}>
                        {prereq.courseName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className={`text-lg font-medium mb-3 ${colors.gradient.text}`}>Enrolled Students ({course.enrolledStudents.length})</h3>
            <div className={`${colors.innerCard} rounded-lg overflow-x-auto`}>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className={`p-3 text-left ${colors.text}`}>Student Name</th>
                    <th className={`p-3 text-left ${colors.text}`}>Enrollment Date</th>
                    <th className={`p-3 text-left ${colors.text}`}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {course.enrolledStudents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className={`p-3 ${colors.secondaryText}`}>No students enrolled.</td>
                    </tr>
                  ) : (
                    course.enrolledStudents.slice(0, 10).map((enrollment, index) => (
                      <tr key={enrollment.student._id} className={index % 2 === 0 ? '' : 'bg-gray-800 bg-opacity-30'}>
                        <td className={`p-3 ${colors.text}`}>{enrollment.student.name}</td>
                        <td className={`p-3 ${colors.secondaryText}`}>
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </td>
                        <td className={`p-3`}>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            enrollment.grade === 'A' ? 'bg-green-100 text-green-800' :
                            enrollment.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            enrollment.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            enrollment.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                            enrollment.grade === 'F' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {enrollment.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  {course.enrolledStudents.length > 10 && (
                    <tr>
                      <td colSpan="3" className={`p-3 text-center ${colors.secondaryText}`}>
                        ... and {course.enrolledStudents.length - 10} more students
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-600 mr-2"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${colors.button.orange}`}
              onClick={() => onEditClick(course)}
            >
              <Edit2 className="mr-1 h-4 w-4 inline" />
              Edit Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal;