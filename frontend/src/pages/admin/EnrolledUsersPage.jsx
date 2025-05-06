// Main Component - EnrolledUsersPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from './../../context/ThemeProvider';
import { 
  Search, Download, Filter, ChevronDown, 
  UserCircle, Users, Calendar, ChevronRight, X
} from 'lucide-react';

// Import components
import UserTypeToggle from '../../components/admin/EnrolledUsersPageComponents/UserTypeToggle';
import SearchAndFilters from '../../components/admin/EnrolledUsersPageComponents/SearchAndFilters';
import StudentsView from '../../components/admin/EnrolledUsersPageComponents/StudentsView';
import TeachersView from '../../components/admin/EnrolledUsersPageComponents/TeachersView';
import SummaryCard from '../../components/admin/EnrolledUsersPageComponents/SummaryCard';
import { mockStudents, mockTeachers } from '../../components/admin/EnrolledUsersPageComponents/MockData';
import { fetchTeachers, fetchStudents } from '../../app/features/users/userThunks';
import { useDispatch, useSelector } from 'react-redux';
const EnrolledUsersPage = () => {
  const { themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const [viewMode, setViewMode] = useState('students'); // 'students' or 'teachers'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const usersState = useSelector((state) => state.users);
  const { 
    teachers = [], 
    students = [],
    loading: { teachers: teachersLoading, students: studentsLoading },
    error: { teachers: teachersError, students: studentsError }
  } = usersState;



// ...

const courses = useMemo(() => {
  return [...new Set(mockStudents.map(student => student.course))];
}, []); // Empty deps because mockStudents doesn't change

const groups = useMemo(() => {
  if (selectedCourse) {
    return [...new Set(mockStudents.filter(s => s.course === selectedCourse).map(s => s.group))];
  } else {
    return [...new Set(mockStudents.map(s => s.group))];
  }
}, [selectedCourse]); // Depends on selectedCourse


    const dispatch = useDispatch();
  useEffect(() => {
    const fetchInitialData = async () => {
      
      
      if (!teachers.length && !teachersLoading) {
        dispatch(fetchTeachers());
      }
      
      if (!students.length && !studentsLoading) {
        dispatch(fetchStudents());
      }
      
    };
    fetchInitialData();
    // console.log("teachers in users page:" ,  teachers);
    
  }, [dispatch]);

  const filteredTeachers = Array.isArray(teachers) 
    ? teachers.filter(teacher => {
        return searchTerm === '' || 
          `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];
  // Filter teachers based on search
  const filteredStudents = Array.isArray(students)
  ? students.filter(student => {
      const matchesSearch = searchTerm === '' || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = selectedCourse === '' || student.course === selectedCourse;
      const matchesGroup = selectedGroup === '' || student.group === selectedGroup;
      
      return matchesSearch && matchesCourse && matchesGroup;
    })
  : [];
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = viewMode === 'students' 
    ? Math.ceil(filteredStudents.length / itemsPerPage)
    : Math.ceil(filteredTeachers.length / itemsPerPage);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, selectedGroup, viewMode]);
  
  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Clear filters
  const clearFilters = () => {
    setSelectedCourse('');
    setSelectedGroup('');
    setSearchTerm('');
  };
  
  // Navigation to student record
  const navigateToStudentRecord = (studentId) => {
    console.log(`Navigating to record for student ID: ${studentId}`);
    alert(`Navigating to attendance records for student ID: ${studentId}`);
  };
  
  return (
    <div className={`${currentTheme.background} min-h-screen p-6`}>
      <div className={`${currentTheme.gradientBackground} rounded-xl p-6 shadow-lg`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
            Enrolled Users
          </h1>
          
          {/* Active filters indicators */}
          <ActiveFilters 
            selectedCourse={selectedCourse}
            selectedGroup={selectedGroup}
            searchTerm={searchTerm}
            setSelectedCourse={setSelectedCourse}
            setSelectedGroup={setSelectedGroup}
            setSearchTerm={setSearchTerm}
            clearFilters={clearFilters}
            theme={theme}
            currentTheme={currentTheme}
          />
        </div>

        {/* Toggle between Students and Teachers */}
        <UserTypeToggle 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          theme={theme} 
          currentTheme={currentTheme}
        />

        {/* Search and Filters */}
        <SearchAndFilters 
          viewMode={viewMode} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          isFilterOpen={isFilterOpen} 
          setIsFilterOpen={setIsFilterOpen}
          selectedCourse={selectedCourse} 
          setSelectedCourse={setSelectedCourse}
          selectedGroup={selectedGroup} 
          setSelectedGroup={setSelectedGroup}
          courses={courses}
          groups={groups}
          clearFilters={clearFilters}
          theme={theme}
          currentTheme={currentTheme}
        />

        {/* Content View */}
        {viewMode === 'students' ? (
          <StudentsView 
            currentStudents={currentStudents}
            filteredStudents={filteredStudents}
            selectedCourse={selectedCourse}
            selectedGroup={selectedGroup}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            paginate={paginate}
            navigateToStudentRecord={navigateToStudentRecord}
            theme={theme}
            currentTheme={currentTheme}
          />
        ) : (
          <TeachersView 
            currentTeachers={currentTeachers}
            filteredTeachers={filteredTeachers}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            paginate={paginate}
            theme={theme}
            currentTheme={currentTheme}
          />
        )}

        {/* Summary Card */}
        <SummaryCard 
          teachers={mockTeachers}
          theme={theme}
          currentTheme={currentTheme}
        />
      </div>
    </div>
  );
};

// Active Filters Component
const ActiveFilters = ({ 
  selectedCourse, 
  selectedGroup, 
  searchTerm, 
  setSelectedCourse, 
  setSelectedGroup, 
  setSearchTerm, 
  clearFilters, 
  theme, 
  currentTheme 
}) => {
  if (!(selectedCourse || selectedGroup || searchTerm)) return null;
  
  return (
    <div className="flex gap-2 items-center">
      <span className={`${currentTheme.secondaryText} text-sm`}>Filters:</span>
      {selectedCourse && (
        <span className={`${
          theme === 'dark' 
            ? 'bg-[#121A22] text-white border border-[#1E2733]' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
          } text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
          Course: {selectedCourse}
          <button onClick={() => setSelectedCourse('')}>
            <X size={14} />
          </button>
        </span>
      )}
      {selectedGroup && (
        <span className={`${
          theme === 'dark' 
            ? 'bg-[#121A22] text-white border border-[#1E2733]' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
          } text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
          Group: {selectedGroup}
          <button onClick={() => setSelectedGroup('')}>
            <X size={14} />
          </button>
        </span>
      )}
      {searchTerm && (
        <span className={`${
          theme === 'dark' 
            ? 'bg-[#121A22] text-white border border-[#1E2733]' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
          } text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
          Search: "{searchTerm}"
          <button onClick={() => setSearchTerm('')}>
            <X size={14} />
          </button>
        </span>
      )}
      <button 
        onClick={clearFilters}
        className={`text-xs ${currentTheme.secondaryText} hover:${currentTheme.text} underline`}
      >
        Clear all
      </button>
    </div>
  );
};

export default EnrolledUsersPage;