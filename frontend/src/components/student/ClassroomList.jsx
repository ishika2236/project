import React from 'react';

const ClassroomList = ({
  classrooms,
  onSelectClassroom,
  currentTheme,
  isDark
}) => {
  const isDarkTheme = isDark;

  if (!classrooms || classrooms.length === 0) {
    return (
      <div className={`p-6 rounded-lg shadow-xl ${currentTheme.gradientBackground} ${currentTheme.text}`}>
        <h2 className="text-2xl font-semibold mb-2">No classrooms found</h2>
        <p className={`${currentTheme.secondaryText}`}>You are not enrolled in any classrooms yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${currentTheme.gradient?.text}`}>
        My Classrooms
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <div
            key={classroom._id}
            className={`cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border ${
              currentTheme.card
            }`}
            onClick={() => onSelectClassroom(classroom)}
          >
            {/* Top Gradient Bar */}
            <div
              className={`h-24 ${
                isDarkTheme
                  ? 'bg-gradient-to-r from-[#506EE5] to-[#2F955A]'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              } flex items-center justify-center`}
            >
              <h3 className="text-white text-xl font-semibold">
                {classroom.course?.courseCode || 'No Code'}
              </h3>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>
                {classroom.course?.courseName || 'Unnamed Course'}
              </h3>

              <p className={`line-clamp-2 mb-4 ${currentTheme.secondaryText}`}>
                {classroom.course?.courseDescription || 'No description available'}
              </p>

              <div className={`text-sm mb-4 space-y-1 ${currentTheme.secondaryText}`}>
                <p>
                  <span className="font-medium">Department:</span>{' '}
                  {classroom.department?.name || 'Not Assigned'}
                </p>
                <p>
                  <span className="font-medium">Group:</span>{' '}
                  {classroom.group?.name || 'Not Assigned'}
                </p>
                <p>
                  <span className="font-medium">Teacher:</span>{' '}
                  {classroom.assignedTeacher
                    ? `${classroom.assignedTeacher.firstName} ${classroom.assignedTeacher.lastName}`
                    : 'Not Assigned'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClassroom(classroom);
                }}
                className={`w-full py-2 px-4 mt-2 text-center text-white font-medium rounded-lg ${
                  isDarkTheme
                    ? currentTheme.button.green
                    : currentTheme.button.gradient
                }`}
              >
                View Classroom
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassroomList;
