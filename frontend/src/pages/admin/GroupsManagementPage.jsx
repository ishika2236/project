import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider'
import GroupsList from '../../components/admin/groupManagement/GroupsList';
import GroupDetails from '../../components/admin/groupManagement/GroupDetails';
import GroupForm from '../../components/admin/groupManagement/GroupForm';
import GroupFilters from '../../components/admin/groupManagement/GroupFilters';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCourses } from './../../app/features/courses/courseThunks'
import { fetchTeachers, fetchStudents } from '../../app/features/users/userThunks';
import { 
  createGroup, 
  fetchGroups, 
  assignStudentToGroup 
} from '../../app/features/groups/groupThunks';

const GroupsManagementPage = () => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  const coursesState = useSelector((state) => state.courses);
  const { courses = [], loading: coursesLoading, error: coursesError } = coursesState;
  
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
  
  const [selectedCourse, setSelectedCourse] = useState(null);
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
      if (!courses.length && !coursesLoading) {
        dispatch(fetchAdminCourses());
      }
      
      if (!teachers.length && !teachersLoading) {
        dispatch(fetchTeachers());
      }
      
      if (!students.length && !studentsLoading) {
        dispatch(fetchStudents());
      }
      
      if (Object.keys(allGroups).length === 0 && !groupsLoading) {
        dispatch(fetchGroups({ isAdmin: true }));
      }
    };
    fetchInitialData();
    // console.log(students);
    
  }, [dispatch]);
  
  // Flatten groups separately after they're loaded
  useEffect(() => {
    if (!groupsLoading && Object.keys(allGroups).length > 0) {
      const flattened = [];
      Object.keys(allGroups).forEach(courseId => {
        if (Array.isArray(allGroups[courseId])) {
          allGroups[courseId].forEach(group => {
            flattened.push({
              ...group,
              courseId,
              // Add additional fields needed for the UI
              teacherName: group.mentor?.name || 'Unassigned',
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
    // Replace with actual API call
    try {
      // Filter the group out of the flattened list
      const updatedGroups = flattenedGroups.filter(group => group._id !== groupId);
      setFlattenedGroups(updatedGroups);
      
      if (selectedGroup && selectedGroup._id === groupId) {
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (isCreating) {
        // Create new group
        dispatch(createGroup(groupData)).then(response => {
          if (response.meta.requestStatus === 'fulfilled') {
            setIsCreating(false);
          }
        });
      } else if (isEditing && selectedGroup) {
        // Handle group update when that's implemented
        // For now, just update locally
        const updatedGroups = flattenedGroups.map(group => 
          group._id === selectedGroup._id ? { ...group, ...groupData } : group
        );
        
        setFlattenedGroups(updatedGroups);
        setSelectedGroup({ ...selectedGroup, ...groupData });
        setIsEditing(false);
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
        // Update the local state to reflect the changes
        // This is a temporary solution until we refresh the data from the API
        const updatedGroups = flattenedGroups.map(group => {
          if (group._id === groupId) {
            // Add the new students to the group
            const updatedStudents = [...(group.students || [])];
            studentIds.forEach(studentId => {
              // Only add if not already in the group
              if (!updatedStudents.find(s => s._id === studentId)) {
                // Find the student from the students array
                const student = students.find(s => s._id === studentId);
                if (student) {
                  updatedStudents.push(student);
                }
              }
            });
            
            return {
              ...group,
              students: updatedStudents,
              studentCount: updatedStudents.length
            };
          }
          return group;
        });
        
        setFlattenedGroups(updatedGroups);
        
        // If the selected group is the one being updated, update it as well
        if (selectedGroup && selectedGroup._id === groupId) {
          const updatedStudents = [...(selectedGroup.students || [])];
          studentIds.forEach(studentId => {
            if (!updatedStudents.find(s => s._id === studentId)) {
              const student = students.find(s => s._id === studentId);
              if (student) {
                updatedStudents.push(student);
              }
            }
          });
          
          setSelectedGroup({
            ...selectedGroup,
            students: updatedStudents,
            studentCount: updatedStudents.length
          });
        }
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
    
    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(group => 
        group.courseId === selectedCourse._id || 
        (group.course && group.course._id === selectedCourse._id)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name?.toLowerCase().includes(query) || 
        group.teacherName?.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
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
              courses={courses}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
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
                courses={courses || []}  // Ensure it's always an array
                isEditing={isEditing}
                groupData={selectedGroup}
                onSave={handleSaveGroup}
                onCancel={handleCancelForm}
                teachers={teachers?.teachers || []}  // Ensure it's always an array
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