// SearchAndFilters.jsx
import React from 'react';
import { Search, Filter, Download, ChevronDown, X } from 'lucide-react';

const SearchAndFilters = ({
  viewMode,
  searchTerm,
  setSearchTerm,
  isFilterOpen,
  setIsFilterOpen,
  selectedCourse,
  setSelectedCourse,
  selectedGroup,
  setSelectedGroup,
  courses,
  groups,
  clearFilters,
  theme,
  currentTheme
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className={`flex-1 relative ${
        theme === 'dark' 
          ? 'bg-[#0A0E13] border border-[#1E2733]' 
          : 'bg-white border border-[#BDC3C7]'
      } rounded-lg overflow-hidden`}>
        <input
          type="text"
          placeholder={`Search ${viewMode === 'students' ? 'students' : 'teachers'}...`}
          className={`w-full px-12 py-3 outline-none ${currentTheme.text} bg-transparent`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.secondaryText}`} size={18} />
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <button 
            className={`${theme === 'dark' ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-white border border-[#BDC3C7]'} ${currentTheme.text} px-4 py-2 rounded-lg flex items-center gap-2`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
            <span>Filter</span>
            <ChevronDown size={16} />
          </button>
          
          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-10 ${
              theme === 'dark' ? 'bg-[#0A0E13] border border-[#1E2733]' : 'bg-white border border-[#BDC3C7]'
            }`}>
              <div className="p-4 space-y-4">
                {viewMode === 'students' && (
                  <>
                    <div>
                      <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>
                        Course
                      </label>
                      <select
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-[#121A22] border border-[#1E2733] text-white' 
                            : 'bg-gray-100 border border-[#BDC3C7] text-gray-800'
                        }`}
                        value={selectedCourse}
                        onChange={(e) => {
                          setSelectedCourse(e.target.value);
                          setSelectedGroup(''); // Reset group when course changes
                        }}
                      >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>
                        Group
                      </label>
                      <select
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-[#121A22] border border-[#1E2733] text-white' 
                            : 'bg-gray-100 border border-[#BDC3C7] text-gray-800'
                        }`}
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        disabled={!selectedCourse}
                      >
                        <option value="">All Groups</option>
                        {groups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                {viewMode === 'teachers' && (
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>
                      Department
                    </label>
                    <select
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-[#121A22] border border-[#1E2733] text-white' 
                          : 'bg-gray-100 border border-[#BDC3C7] text-gray-800'
                      }`}
                    >
                      <option value="">All Departments</option>
                    </select>
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={clearFilters}
                    className={`text-sm ${currentTheme.secondaryText}`}
                  >
                    Clear filters
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className={`text-sm font-medium ${currentTheme.text}`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className={`${theme === 'dark' ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-white border border-[#BDC3C7]'} ${currentTheme.text} px-4 py-3 rounded-lg flex items-center gap-2`}>
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;