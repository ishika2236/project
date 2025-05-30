// Fixed GroupsManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import GroupsList from '../../components/admin/groupManagement/GroupsList';
import GroupDetails from '../../components/admin/groupManagement/GroupDetails';
import GroupForm from '../../components/admin/groupManagement/GroupForm';
import GroupFilters from '../../components/admin/groupManagement/GroupFilters';
import ToastContainer from '../../components/ToastContainer';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from './../../app/features/departments/departmentThunks';
import { fetchTeachers, fetchStudents } from '../../app/features/users/userThunks';
import { 
  createGroup, 
  fetchGroups,
  fetchAllGroups,
  assignStudentToGroup,
  deleteGroup,
  updateGroup,
  removeStudentFromGroup
} from '../../app/features/groups/groupThunks';

const GroupsManagementPage = () => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const departmentsState = useSelector((state) => state.departments);
  const { departments = [], loading: departmentsLoading, error: departmentsError } = departmentsState;
  
  const usersState = useSelector((state) => state.users);
  const { 
    teachers = [], 
    students = [],
    loading: { teachers: teachersLoading, students: studentsLoading },
    error: { teachers: teachersError, students: studentsError }
  } = usersState;
  
  // Properly access groups from Redux store
  const groupsState = useSelector((state) => state.groups);
  const { allGroups, loading: groupsLoading, error: groupsError } = groupsState;
  
  // Flatten groups for display in the component
  const [flattenedGroups, setFlattenedGroups] = useState([]);
  
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [addingStudents, setAddingStudents] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(false);
  const dispatch = useDispatch();

  // Fetch initial data only once when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!departments.length && !departmentsLoading) {
        dispatch(fetchDepartments());
      }
      
      if (!teachers.length && !teachersLoading) {
        dispatch(fetchTeachers());
      }
      
      if (!students.length && !studentsLoading) {
        dispatch(fetchStudents());
      }
      
      // Always fetch groups data on component mount to ensure fresh data
      dispatch(fetchAllGroups());
    };
    fetchInitialData();
  }, [dispatch, departments.length, teachers.length, students.length, departmentsLoading, teachersLoading, studentsLoading]);
  
  // This function flattens the groups - moved outside useEffect to avoid creating it on every render
  const flattenGroups = useCallback(() => {
    if (Object.keys(allGroups).length > 0) {
      const flattened = [];
      Object.keys(allGroups).forEach(departmentId => {
        if (Array.isArray(allGroups[departmentId])) {
          allGroups[departmentId].forEach(group => {
            flattened.push({
              ...group,
              departmentId,
              mentorName: group.mentor?.firstName && group.mentor?.lastName 
                ? `${group.mentor.firstName} ${group.mentor.lastName}` 
                : 'Unassigned',
              studentCount: group.students?.length || 0
            });
          });
        }
      });
      return flattened;
    }
    return [];
  }, [allGroups]);
  
  // Update flattened groups when allGroups changes
  useEffect(() => {
    const flattened = flattenGroups();
    setFlattenedGroups(flattened);
  }, [flattenGroups]);
  
  // Separate effect to update selected group when needed
  useEffect(() => {
    if (selectedGroup && flattenedGroups.length > 0) {
      const updatedSelectedGroup = flattenedGroups.find(g => g._id === selectedGroup._id);
      if (updatedSelectedGroup && JSON.stringify(updatedSelectedGroup) !== JSON.stringify(selectedGroup)) {
        setSelectedGroup(updatedSelectedGroup);
      }
    }
  }, [flattenedGroups, selectedGroup]);
  
  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const result = await dispatch(deleteGroup(groupId));
      if (result.meta.requestStatus === 'fulfilled') {
        // Clear selected group if it was deleted
        if (selectedGroup && selectedGroup._id === groupId) {
          setSelectedGroup(null);
        }
        
        // Toast notification
        if (window.toastManager) {
          window.toastManager.success('Group deleted successfully');
        }
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      if (window.toastManager) {
        window.toastManager.error('Failed to delete group');
      }
    }
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (isCreating) {
        // Create new group
        const result = await dispatch(createGroup(groupData));
        if (result.meta.requestStatus === 'fulfilled') {
          setIsCreating(false);
          
          // Toast notification
          if (window.toastManager) {
            window.toastManager.success('Group created successfully');
          }
          
          // Optionally select the newly created group
          if (result.payload && result.payload.group) {
            // Need to manually enrich the group with UI properties
            const newGroup = {
              ...result.payload.group,
              departmentId: result.payload.group.department._id,
              mentorName: result.payload.group.mentor?.firstName && result.payload.group.mentor?.lastName 
                ? `${result.payload.group.mentor.firstName} ${result.payload.group.mentor.lastName}` 
                : 'Unassigned',
              studentCount: result.payload.group.students?.length || 0
            };
            setSelectedGroup(newGroup);
          }
        }
      } else if (isEditing && selectedGroup) {
        // Update existing group
        const result = await dispatch(updateGroup({
          groupId: selectedGroup._id,
          groupData: groupData
        }));
        
        if (result.meta.requestStatus === 'fulfilled') {
          setIsEditing(false);
          
          // Toast notification
          if (window.toastManager) {
            window.toastManager.success('Group updated successfully');
          }
        }
      }
    } catch (error) {
      console.error('Error saving group:', error);
      if (window.toastManager) {
        window.toastManager.error('Failed to save group');
      }
    }
  };

  const handleAddStudentsToGroup = async (groupId, studentIds) => {
    if (!groupId || !studentIds || studentIds.length === 0) {
      console.error('Invalid group ID or student IDs');
      return;
    }

    setAddingStudents(true);
    try {
      const result = await dispatch(assignStudentToGroup({ 
        groupId, 
        studentIds
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Show success toast notification
        if (window.toastManager) {
          const count = studentIds.length;
          const group = flattenedGroups.find(g => g._id === groupId);
          const groupName = group ? group.name : 'the group';
          
          window.toastManager.success(
            `${count} ${count === 1 ? 'student' : 'students'} added to ${groupName}`
          );
        }
      }
    } catch (error) {
      console.error('Error adding students to group:', error);
      if (window.toastManager) {
        window.toastManager.error('Failed to add students to group');
      }
    } finally {
      setAddingStudents(false);
    }
  };
  
  const handleRemoveStudentFromGroup = async (groupId, studentId) => {
    if (!groupId || !studentId) {
      console.error('Invalid group ID or student ID');
      return;
    }

    setRemovingStudent(true);
    try {
      const result = await dispatch(removeStudentFromGroup({ 
        groupId, 
        studentId
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Show success toast notification
        if (window.toastManager) {
          const student = students.find(s => s._id === studentId);
          const group = flattenedGroups.find(g => g._id === groupId);
          const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
          const groupName = group ? group.name : 'the group';
          
          window.toastManager.success(`${studentName} was removed from ${groupName}`);
        }
      }
    } catch (error) {
      console.error('Error removing student from group:', error);
      if (window.toastManager) {
        window.toastManager.error('Failed to remove student from group');
      }
    } finally {
      setRemovingStudent(false);
    }
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const filterGroups = useCallback(() => {
    let filtered = [...flattenedGroups];
    
    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(group => 
        group.departmentId === selectedDepartment._id || 
        (group.department && group.department._id === selectedDepartment._id)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name?.toLowerCase().includes(query) || 
        group.mentorName?.toLowerCase().includes(query)
      );
    }
    
    // Filter by size
    if (filterBy === 'large') {
      filtered = filtered.filter(group => group.studentCount >= 15);
    } else if (filterBy === 'small') {
      filtered = filtered.filter(group => group.studentCount < 15);
    }
    
    return filtered;
  }, [flattenedGroups, selectedDepartment, searchQuery, filterBy]);

  // Get filtered groups without re-computing on every render
  const filteredGroups = filterGroups();

  return (
    <div className={colors.background + " min-h-screen p-6"}>
      {/* Toast Container for notifications */}
      
      
      <div className={colors.gradientBackground + " rounded-lg shadow-lg p-6"}>
        <h1 className={`text-2xl font-bold mb-6 ${colors.text}`}>
          Groups Management
        </h1>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: '100px', zIndex: 999999 }} 
      />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Filters and Groups List */}
          <div className="lg:col-span-1">
            <GroupFilters 
              departments={departments}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <h2 className={`text-lg font-semibold ${colors.text}`}>Groups</h2>
              <button
                onClick={handleCreateGroup}
                className={colors.button.primary + " px-3 py-2 rounded-md flex items-center"}
              >
                <Plus size={16} className="mr-1" />
                <span>Create Group</span>
              </button>
            </div>
            
            <GroupsList 
              groups={filteredGroups}
              onEdit={handleEditGroup}
              onView={handleViewGroup}
              onDelete={handleDeleteGroup}
              loading={groupsLoading}
            />
          </div>
          
          {/* Right column: Group Details or Create/Edit Form */}
          <div className="lg:col-span-2">
            {isCreating || isEditing ? (
              <GroupForm 
                departments={departments || []}
                isEditing={isEditing}
                groupData={selectedGroup}
                onSave={handleSaveGroup}
                onCancel={handleCancelForm}
                teachers={teachers || []}
              />
            ) : selectedGroup ? (
              <GroupDetails 
                group={selectedGroup}
                onEdit={() => handleEditGroup(selectedGroup)}
                onAddStudents={handleAddStudentsToGroup}
                onRemoveStudent={(studentId) => handleRemoveStudentFromGroup(selectedGroup._id, studentId)}
                allStudents={students}
                isAddingStudents={addingStudents}
                isRemovingStudent={removingStudent}
              />
            ) : (
              <div className={colors.card + " rounded-lg p-8 flex flex-col items-center justify-center h-full"}>
                <p className={colors.secondaryText + " text-center"}>
                  Select a group to view details or create a new group
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsManagementPage;