import React from 'react';
import { Layers, Grid, Search } from 'lucide-react';

const GroupView = ({ 
  selectedCourse, 
  filteredGroups, 
  paginatedGroups, 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  groupsPerPage, 
  setGroupsPerPage, 
  theme, 
  colors 
}) => {
  return (
    <div>
      {/* Group stats header */}
      <div className={`bg-transparent border rounded-xl p-4 mb-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="rounded-full p-2" style={{
              background: theme === 'dark' 
                ? `linear-gradient(135deg, ${selectedCourse.color}40, transparent)` 
                : `linear-gradient(135deg, ${selectedCourse.color}20, ${selectedCourse.color}05)`
            }}>
              <Layers size={20} style={{ color: selectedCourse.color }} />
            </div>
            <div>
              <h3 className={`${colors.text} text-lg font-medium`}>{selectedCourse.name}</h3>
              <p className={`${colors.secondaryText} text-sm`}>
                {selectedCourse.students} students in {selectedCourse.totalGroups} groups
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
              <p className={`${colors.secondaryText} text-xs`}>Avg. Group Size</p>
              <p className={`${colors.text} font-bold`}>
                {Math.round(selectedCourse.students / selectedCourse.totalGroups)}
              </p>
            </div>
            
            <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
              <p className={`${colors.secondaryText} text-xs`}>Largest Group</p>
              <p className={`${colors.text} font-bold`}>
                {Math.max(...selectedCourse.groups.map(g => g.students))}
              </p>
            </div>
            
            <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
              <p className={`${colors.secondaryText} text-xs`}>Smallest Group</p>
              <p className={`${colors.text} font-bold`}>
                {Math.min(...selectedCourse.groups.map(g => g.students))}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Paginated group grid */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={`${colors.secondaryText} text-sm`}>
            Showing {paginatedGroups.length} of {filteredGroups.length} groups
          </p>
          
          <select
            value={groupsPerPage}
            onChange={(e) => setGroupsPerPage(Number(e.target.value))}
            className={`px-2 py-1 rounded text-sm border ${
              theme === 'dark' 
                ? 'bg-transparent text-white border-gray-700' 
                : 'bg-white text-gray-800 border-gray-200'
            }`}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        
        <div className="space-y-2">
          {paginatedGroups.map((group, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-opacity-50' 
                  : 'border-gray-100 hover:border-gray-200'
              } bg-transparent hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid size={16} style={{ color: group.courseColor }} />
                  <div>
                    <h4 className={`${colors.text} font-medium flex items-center gap-1`}>
                      {group.name}
                      {group.courseName !== selectedCourse.name && (
                        <span className={`text-xs ${colors.secondaryText}`}>
                          ({group.courseName})
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`${colors.secondaryText} text-sm`}>
                    Students
                  </span>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${colors.text} font-medium border ${
                      theme === 'dark' ? 'border-gray-700 bg-transparent' : 'border-gray-100 bg-white'
                    }`}
                  >
                    {group.students}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-transparent rounded-full h-1.5 overflow-hidden border border-opacity-10"
                  style={{ borderColor: theme === 'dark' ? '#4A5568' : '#E2E8F0' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(group.students / Math.max(...filteredGroups.map(g => g.students))) * 100}%`,
                      background: `linear-gradient(90deg, ${group.courseColor}BB, ${group.courseColor}33)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                currentPage === 1
                  ? theme === 'dark' ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'
                  : theme === 'dark' ? 'border-gray-700 text-white hover:border-blue-500/30' : 'border-gray-200 text-gray-800 hover:border-blue-300'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : theme === 'dark' ? 'bg-transparent border border-gray-800 text-white' : 'bg-white border border-gray-100 text-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className={colors.secondaryText}>...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border ${
                      theme === 'dark' ? 'bg-transparent border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-800'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                currentPage === totalPages
                  ? theme === 'dark' ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'
                  : theme === 'dark' ? 'border-gray-700 text-white hover:border-blue-500/30' : 'border-gray-200 text-gray-800 hover:border-blue-300'
              }`}
            >
              Next
            </button>
          </div>
        )}
        
        {/* Empty state */}
        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search size={48} className={`${colors.secondaryText} opacity-20 mb-4`} />
            <p className={`text-lg font-medium ${colors.text}`}>No groups found</p>
            <p className={`text-sm ${colors.secondaryText}`}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupView;