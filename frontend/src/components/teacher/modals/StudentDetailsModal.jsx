// StudentDetailsModal.js
import React from 'react';
import { X, Calendar, Clock, User, BookOpen } from 'lucide-react';

const StudentDetailsModal = ({ student, onClose, isOpen }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {student.studentName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Roll Number: {student.rollNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Student Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Classes</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {student.totalClasses}
                </p>
              </div>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Present</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {student.presentClasses}
                </p>
              </div>
              <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Absent</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {student.absentClasses}
                </p>
              </div>
              <div className="h-6 w-6 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Late</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {student.lateClasses}
                </p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Attendance Percentage with Visual Progress */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Attendance Performance
            </h3>
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                student.attendancePercentage >= 90 ? 'text-green-600' :
                student.attendancePercentage >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {student.attendancePercentage}%
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall Attendance
              </p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                student.attendancePercentage >= 90 ? 'bg-green-600' :
                student.attendancePercentage >= 75 ? 'bg-yellow-400' : 'bg-red-600'
              }`}
              style={{ width: `${student.attendancePercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>0%</span>
            <span className="text-yellow-600">75% (Minimum)</span>
            <span className="text-green-600">90% (Excellent)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Attendance Status Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Distribution
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                <div 
                  className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(student.presentClasses / student.totalClasses) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Present</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {((student.presentClasses / student.totalClasses) * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                <div 
                  className="h-2 bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(student.absentClasses / student.totalClasses) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Absent</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {((student.absentClasses / student.totalClasses) * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                <div 
                  className="h-2 bg-yellow-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(student.lateClasses / student.totalClasses) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Late</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {((student.lateClasses / student.totalClasses) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Recent Attendance Records */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Attendance Records
            </h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Late
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {student.records?.slice(0, 15).map((record, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.classDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.classTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.isLate ? (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Late
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                          On Time
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {record.faceRecognized ? 'Face Recognition' : 'Manual'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Handle export individual student report
              console.log('Export student report for:', student.studentName);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;