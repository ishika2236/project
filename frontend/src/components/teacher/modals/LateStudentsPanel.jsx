import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, User, Calendar, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const LateStudentsPanel = ({ 
  lateStudents = [], 
  allRecords = [], 
  onStudentClick,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('consecutive'); // consecutive, total, name
  const [filterDays, setFilterDays] = useState(3);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort late students based on current settings
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = lateStudents.filter(student => 
      student.maxConsecutiveLate >= filterDays
    );

    switch (sortBy) {
      case 'consecutive':
        return filtered.sort((a, b) => b.maxConsecutiveLate - a.maxConsecutiveLate);
      case 'total':
        return filtered.sort((a, b) => b.totalLateClasses - a.totalLateClasses);
      case 'name':
        return filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
      default:
        return filtered;
    }
  }, [lateStudents, sortBy, filterDays]);

  // Get recent late patterns for a student
  const getRecentLatePattern = (student) => {
    const studentRecords = allRecords
      .filter(record => record.rollNumber === student.rollNumber && record.isLate)
      .sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt))
      .slice(0, 5);

    return studentRecords;
  };

  // Calculate late frequency percentage
  const getLateFrequency = (student) => {
    return ((student.totalLateClasses / student.totalClasses) * 100).toFixed(1);
  };

  // Get severity level based on consecutive late days
  const getSeverityLevel = (consecutiveDays) => {
    if (consecutiveDays >= 7) return { level: 'critical', color: 'bg-red-600', textColor: 'text-red-600' };
    if (consecutiveDays >= 5) return { level: 'high', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (consecutiveDays >= 3) return { level: 'medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { level: 'low', color: 'bg-blue-500', textColor: 'text-blue-500' };
  };

  if (!lateStudents || lateStudents.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="text-green-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Late Students Panel
          </h3>
        </div>
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No students with consistent late arrivals found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Students with {filterDays}+ consecutive late days will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Late Students Panel
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Students with consistent late arrivals ({filteredAndSortedStudents.length} found)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Toggle Filters"
            >
              <Filter size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="consecutive">Consecutive Late Days</option>
                <option value="total">Total Late Classes</option>
                <option value="name">Student Name</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Consecutive Days
              </label>
              <select
                value={filterDays}
                onChange={(e) => setFilterDays(parseInt(e.target.value))}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2+ Days</option>
                <option value={3}>3+ Days</option>
                <option value={5}>5+ Days</option>
                <option value={7}>7+ Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    High Risk Students
                  </p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {filteredAndSortedStudents.filter(s => s.maxConsecutiveLate >= 5).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Avg Consecutive Days
                  </p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {filteredAndSortedStudents.length > 0 
                      ? (filteredAndSortedStudents.reduce((sum, s) => sum + s.maxConsecutiveLate, 0) / filteredAndSortedStudents.length).toFixed(1)
                      : '0'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Critical Cases
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {filteredAndSortedStudents.filter(s => s.maxConsecutiveLate >= 7).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {filteredAndSortedStudents.map((student, index) => {
              const severity = getSeverityLevel(student.maxConsecutiveLate);
              const recentPattern = getRecentLatePattern(student);
              const lateFrequency = getLateFrequency(student);

              return (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${severity.color}`}></div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.studentName}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Roll: {student.rollNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 ${severity.textColor}`}>
                          {severity.level.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Consecutive Late</p>
                          <p className="text-xl font-bold text-red-600">
                            {student.maxConsecutiveLate} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Late</p>
                          <p className="text-xl font-bold text-yellow-600">
                            {student.totalLateClasses}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Late Frequency</p>
                          <p className="text-xl font-bold text-orange-600">
                            {lateFrequency}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
                          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                            {student.totalClasses}
                          </p>
                        </div>
                      </div>

                      {/* Recent Late Pattern */}
                      {recentPattern.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Recent Late Arrivals:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {recentPattern.map((record, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full"
                              >
                                <Calendar size={12} className="mr-1" />
                                {new Date(record.markedAt).toLocaleDateString()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Longest Streak Info */}
                      {student.longestLateStreak && student.longestLateStreak.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Longest Late Streak: {student.longestLateStreak.length} consecutive days
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            From {new Date(student.longestLateStreak[0]?.markedAt).toLocaleDateString()} 
                            to {new Date(student.longestLateStreak[student.longestLateStreak.length - 1]?.markedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {onStudentClick && (
                        <button
                          onClick={() => onStudentClick(student)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      )}
                      <button className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                        Send Alert
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          {filteredAndSortedStudents.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Recommended Actions:
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Contact students with 5+ consecutive late days immediately</li>
                <li>• Schedule counseling sessions for critical cases (7+ days)</li>
                <li>• Review class scheduling if multiple students show same pattern</li>
                <li>• Consider implementing early arrival incentives</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {!isExpanded && filteredAndSortedStudents.length > 3 && (
        <div className="px-6 pb-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            View All {filteredAndSortedStudents.length} Students
          </button>
        </div>
      )}
    </div>
  );
};

export default LateStudentsPanel;