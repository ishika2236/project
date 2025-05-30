import React from 'react';
import { AlertTriangle, Mail, Phone, User } from 'lucide-react';

const LowAttendanceAlert = ({ students, onClose, onSendAlert }) => {
  const handleSendAlert = (student) => {
    if (onSendAlert) {
      onSendAlert(student);
    }
  };

  const getAlertSeverity = (percentage) => {
    if (percentage < 50) return 'critical';
    if (percentage < 65) return 'high';
    return 'medium';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Attendance Alerts ({students.length} students)
          </h3>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Low Attendance Issues
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All students are maintaining good attendance records.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student, index) => {
            const severity = getAlertSeverity(parseFloat(student.attendancePercentage));
            const severityColor = getSeverityColor(severity);
            
            return (
              <div key={index} className={`border-l-4 p-4 rounded-lg ${severityColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">{student.studentName}</p>
                      <p className="text-sm opacity-75">Roll: {student.rollNumber}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{student.attendancePercentage}%</p>
                        <p className="text-sm opacity-75">
                          {student.presentClasses}/{student.totalClasses} classes
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendAlert(student)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                          title="Send Email Alert"
                        >
                          <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleSendAlert(student)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                          title="Call Parent/Guardian"
                        >
                          <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex space-x-4 text-sm">
                    <span>Absent: {student.absentClasses}</span>
                    <span>Late: {student.lateClasses}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      severity === 'critical' ? 'bg-red-600 text-white' :
                      severity === 'high' ? 'bg-orange-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {severity.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                {/* Attendance Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Attendance Progress</span>
                    <span>Target: 75%</span>
                  </div>
                  <div className="w-full bg-white dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        parseFloat(student.attendancePercentage) >= 75 ? 'bg-green-600' :
                        parseFloat(student.attendancePercentage) >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(parseFloat(student.attendancePercentage), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Recommended Actions:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Contact parents/guardians of critical and high-risk students</li>
            <li>• Schedule one-on-one meetings to understand attendance issues</li>
            <li>• Consider implementing attendance improvement plans</li>
            <li>• Review if there are any systemic issues affecting attendance</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LowAttendanceAlert;

// LateStudentsPanel.js