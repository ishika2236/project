import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider'
import GroupsList from '../../components/admin/groupManagement/GroupsList';
import GroupDetails from '../../components/admin/groupManagement/GroupDetails';
import GroupForm from '../../components/admin/groupManagement/GroupForm';
import GroupFilters from '../../components/admin/groupManagement/GroupFilters';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from './../../app/features/departments/departmentThunks'
import { fetchTeachers, fetchStudents } from '../../app/features/users/userThunks';
import { 
  createGroup, 
  fetchGroups,
  fetchAllGroups,
  assignStudentToGroup,
  deleteGroup,
  updateGroup
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
      
      if (Object.keys(allGroups).length === 0 && !groupsLoading) {
        dispatch(fetchAllGroups());
      }
    };
    fetchInitialData();
  }, [dispatch]);
  
  // Flatten groups separately after they're loaded
  useEffect(() => {
    if (!groupsLoading && Object.keys(allGroups).length > 0) {
      const flattened = [];
      Object.keys(allGroups).forEach(departmentId => {
        if (Array.isArray(allGroups[departmentId])) {
          allGroups[departmentId].forEach(group => {
            flattened.push({
              ...group,
              departmentId,
              // Add additional fields needed for the UI
              mentorName: group.mentor?.firstName && group.mentor?.lastName 
                ? `${group.mentor.firstName} ${group.mentor.lastName}` 
                : 'Unassigned',
              studentCount: group.students?.length || 0
            });
          });
        }
      });
      setFlattenedGroups(flattened);
    }
  }, [allGroups, groupsLoading]);
  
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
      console.log(groupId)
      const result = await dispatch(deleteGroup(groupId));
      if (result.meta.requestStatus === 'fulfilled') {
        // Filter the group out of the flattened list
        const updatedGroups = flattenedGroups.filter(group => group._id !== groupId);
        setFlattenedGroups(updatedGroups);
        
        if (selectedGroup && selectedGroup._id === groupId) {
          setSelectedGroup(null);
        }
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (isCreating) {
        // Create new group
        const result = await dispatch(createGroup(groupData));
        if (result.meta.requestStatus === 'fulfilled') {
          setIsCreating(false);
          // Refresh groups to get the latest data
          dispatch(fetchAllGroups());
        }
      } else if (isEditing && selectedGroup) {
        // Update existing group
        const result = await dispatch(updateGroup({
          groupId: selectedGroup._id,
          groupData: groupData
        }));
        
        if (result.meta.requestStatus === 'fulfilled') {
          setIsEditing(false);
          // Refresh groups to get the latest data
          dispatch(fetchAllGroups());
        }
      }
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const handleAddStudentsToGroup = async (groupId, studentIds) => {
    if (!groupId || !studentIds || studentIds.length === 0) {
      console.error('Invalid group ID or student IDs');
      return;
    }

    setAddingStudents(true);
    try {
      // Dispatch the action to add students to the group
      const result = await dispatch(assignStudentToGroup({ 
        groupId, 
        studentIds
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Refresh groups to get the latest data
        dispatch(fetchAllGroups());
      }
    } catch (error) {
      console.error('Error adding students to group:', error);
    } finally {
      setAddingStudents(false);
    }
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const filterGroups = () => {
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
  };

  return (
    <div className={`${colors.background} min-h-screen p-6`}>
      <div className={`${colors.gradientBackground} rounded-lg shadow-lg p-6`}>
        <h1 className={`text-2xl font-bold mb-6 ${colors.text}`}>
          Groups Management
        </h1>
        
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
                className={`${colors.button.primary} px-3 py-2 rounded-md flex items-center`}
              >
                <Plus size={16} className="mr-1" />
                <span>Create Group</span>
              </button>
            </div>
            
            <GroupsList 
              groups={filterGroups()}
              onEdit={handleEditGroup}
              onView={handleViewGroup}
              onDelete={handleDeleteGroup}
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
                allStudents={students}
                isAddingStudents={addingStudents}
              />
            ) : (
              <div className={`${colors.card} rounded-lg p-8 flex flex-col items-center justify-center h-full`}>
                <p className={`${colors.secondaryText} text-center`}>
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