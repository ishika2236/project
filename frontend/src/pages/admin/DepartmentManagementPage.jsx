import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import thunks for all required data
import { fetchDepartments } from '../../app/features/departments/departmentThunks';
import { fetchAllGroups } from '../../app/features/groups/groupThunks';
import { fetchAdminCourses } from '../../app/features/courses/courseThunks';

import DepartmentList from '../../components/admin/departmentPageComponents/DepartmentList';
import DepartmentHeader from '../../components/admin/departmentPageComponents/DepartmentHeader';
import DepartmentStatistics from '../../components/admin/departmentPageComponents/DepartmentStatistics';
import CreateDepartmentModal from '../../components/admin/departmentPageComponents/ModalComponents/CreateDepartmentModal';
import EditDepartmentModal from '../../components/admin/departmentPageComponents/ModalComponents/EditDepartmentModal';
import LoadingSpinner from '../../components/admin/departmentPageComponents/LoadingSpinner';
import ErrorAlert from '../../components/admin/departmentPageComponents/ErrorAlert';
import { useTheme } from '../../context/ThemeProvider';
import DepartmentSummary from '../../components/admin/departmentPageComponents/DepartmentSummary';

const DepartmentManagementPage = () => {
  const dispatch = useDispatch();
  const { themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  
  // Get all required state from Redux
  const { departments, isLoading: departmentsLoading, isError, message } = useSelector(
    (state) => state.departments
  );
  
  const groupsState = useSelector((state) => state.groups);
  const { allGroups, loading: groupsLoading, error: groupsError } = groupsState;
  
  const coursesState = useSelector((state) => state.courses);
  const { courses, isLoading: coursesLoading, error: coursesError } = coursesState;

  useEffect(() => {
    // Fetch all required data when the component mounts
    const fetchAllData = async () => {
      setDataLoading(true);
      try {
        await Promise.all([
          dispatch(fetchDepartments()),
          dispatch(fetchAllGroups()),
          dispatch(fetchAdminCourses())
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchAllData();
  }, [dispatch]);

  // Update loading state based on individual loading states
  useEffect(() => {
    const isStillLoading = departmentsLoading || groupsLoading || coursesLoading;
    setDataLoading(isStillLoading);
  }, [departmentsLoading, groupsLoading, coursesLoading]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Show loading spinner if any of the data is still loading
  if (dataLoading) {
    return <LoadingSpinner />;
  }
  
  // Count groups per department
  const getDepartmentGroupCounts = () => {
    const counts = {};
    Object.entries(allGroups || {}).forEach(([departmentId, groups]) => {
      counts[departmentId] = groups.length;
    });
    return counts;
  };
  
  // Count courses per department
  const getDepartmentCourseCounts = () => {
    const counts = {};
    if (courses && courses.length > 0) {
      courses.forEach(course => {
        if (course.department && course.department._id) {
          const deptId = course.department._id;
          counts[deptId] = (counts[deptId] || 0) + 1;
        }
      });
    }
    return counts;
  };
  
  const groupCounts = getDepartmentGroupCounts();
  const courseCounts = getDepartmentCourseCounts();

  return (
    <div className={`${currentTheme.background} min-h-screen p-6`}>
      <div className={`${currentTheme.card} rounded-xl p-6 mb-6`}>
        <DepartmentHeader
          onCreateClick={() => setShowCreateModal(true)}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
        
        {isError && <ErrorAlert message={message} />}
        {groupsError && <ErrorAlert message={groupsError} />}
        {coursesError && <ErrorAlert message={coursesError} />}
        
        <DepartmentStatistics 
          departments={departments} 
          allGroups={allGroups}
          courses={courses}
          isLoading={dataLoading}
        />
        
        <DepartmentList
          departments={filteredDepartments}
          onEditDepartment={setEditingDepartment}
          currentTheme={currentTheme}
          theme={theme}
          groupCounts={groupCounts}
          courseCounts={courseCounts}
          allGroups={allGroups || {}}
          courses={courses || []}
        />
      </div>
      
      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          currentTheme={currentTheme}
          theme={theme}
        />
      )}
      
      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          onClose={() => setEditingDepartment(null)}
          currentTheme={currentTheme}
          theme={theme}
          groups={allGroups[editingDepartment._id] || []}
          courses={courses.filter(course => 
            course.department && course.department._id === editingDepartment._id
          )}
        />
      )}
      
      {/* Uncomment if you want to use DepartmentSummary */}
      {/*
      <DepartmentSummary 
        departments={departments}
        groups={allGroups}
        courses={courses}
      />
      */}
    </div>
  );
};

export default DepartmentManagementPage;