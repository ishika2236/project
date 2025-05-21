import { Clock, Calendar, Map, UserCheck, CheckCircle } from "lucide-react";
const ClassesSection = ({ 
    title, 
    classes, 
    emptyMessage, 
    icon, 
    type,
    openAttendanceModal, 
    isDark 
  }) => {
    return (
      <div className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        
        {classes.length > 0 ? (
          <div className="space-y-3">
            {classes.map(classItem => (
              <div 
                key={classItem.id}
                className={`p-4 rounded-lg border flex justify-between items-center ${
                  type === 'ongoing' 
                    ? (isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200')
                    : type === 'past'
                      ? (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
                      : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    type === 'ongoing' 
                      ? (isDark ? 'bg-blue-800' : 'bg-blue-200')
                      : (isDark ? 'bg-gray-600' : 'bg-gray-200')
                  }`}>
                    {type === 'ongoing' ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{classItem.title}</h3>
                    <div className="flex text-xs mt-1 space-x-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {classItem.time}
                      </span>
                      <span className="flex items-center">
                        <Map className="h-3 w-3 mr-1" />
                        {classItem.room}
                      </span>
                    </div>
                  </div>
                </div>
                
                {type === 'ongoing' && !classItem.attended ? (
                  <button 
                    onClick={() => openAttendanceModal(classItem)}
                    className={`px-3 py-2 rounded-lg text-xs flex items-center ${
                      isDark 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Mark Attendance
                  </button>
                ) : classItem.attended ? (
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center ${
                    isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Present
                  </span>
                ) : type === 'past' ? (
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    Absent
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    Upcoming
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {icon}
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    );
  };
export default ClassesSection;  