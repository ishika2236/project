import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { Plus, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAdminCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  fetchCoursesByDepartment,
  fetchTeacherCourses,
  fetchStudentCourses,
  assignTeacherToCourse
} from '../../app/features/courses/courseThunks';
import { clearCourseMessage } from '../../app/features/courses/courseSlice';

import DashboardCharts from '../../components/admin/courseManagement/DashboardCharts';
import SearchBar from '../../components/admin/courseManagement/SearchBar';
import CourseList from '../../components/admin/courseManagement/courseList';
import EditCourseModal from '../../components/admin/courseManagement/ModalComponents/EditCourseModal';
import ViewCourseModal from '../../components/admin/courseManagement/ModalComponents/ViewCourseModal';
import CreateCourseModal from '../../components/admin/courseManagement/ModalComponents/CreateCourseModal';
import AssignTeacherModal from '../../components/admin/courseManagement/ModalComponents/AssignTeacherModal';
import { toast } from 'react-toastify'; 
import { fetchDepartments } from '../../app/features/departments/departmentThunks';
import { fetchTeachers } from '../../app/features/users/userThunks';
import { fetchAllGroups } from '../../app/features/groups/groupThunks';
import { createClassroom } from '../../app/features/classroom/classroomThunks';

export default function CourseManagement() {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  
  const initialFormState = {
    courseName: '',
    courseCode: '',
    courseDescription: '',
    courseCoordinator: null,
    department: null,
    academicYear: '',
    semester: '',
    credits: 0,
    maxCapacity: 0,
    isActive: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  
  const dispatch = useDispatch();
  
  const { courses = [], isLoading = false, error = null, message = null } = useSelector(state => state.courses || {});
  const departmentsState = useSelector((state) => state.departments);
  const { departments = [], loading: departmentsLoading, error: departmentsError } = departmentsState;
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const usersState = useSelector((state) => state.users);
  const { 
    teachers = [], 
    students = [],
    loading: { teachers: teachersLoading, students: studentsLoading },
    error: { teachers: teachersError, students: studentsError }
  } = usersState;
  const groupsState = useSelector((state) => state.groups);
  const { 
    allGroups = {}, 
    loading: groupsLoading,
    error: groupsError 
  } = groupsState;

  // Load courses when component mounts
  useEffect(() => {
    if (user.role === 'admin') {
      dispatch(fetchAdminCourses());
    } else if (user.role === 'teacher') {
      dispatch(fetchTeacherCourses());
    } else if (user.role === 'student') {
      dispatch(fetchStudentCourses());
    }
  }, [dispatch, user.role]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!departments.length && !departmentsLoading) {
        dispatch(fetchDepartments());
      }
      
      if (!teachers.length && !teachersLoading) {
        dispatch(fetchTeachers());
      }

      if (Object.keys(allGroups).length === 0 && !groupsLoading) {
        dispatch(fetchAllGroups());
      }
    };
    fetchInitialData();
  }, [dispatch]);
  
  // Handle messages/errors from Redux state
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearCourseMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearCourseMessage());
    }
  }, [message, error, dispatch]);

  // Handle search functionality
  const filteredCourses = courses.filter(course =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Robust handleInputChange function
  const handleFormInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (isValidFormData(formData)) {
      try {
        await dispatch(createCourse(formData)).unwrap();
        setIsCreating(false);
        resetFormData();
      } catch (err) {
        console.error('Failed to create course:', err);
      }
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap();
      } catch (err) {
        console.error('Failed to delete course:', err);
      }
    }
  };

  // Validation for form data
  const isValidFormData = (data) => {
    return (
      data.courseName &&
      data.courseCode &&
      data.courseDescription &&
      // data.department &&
      data.academicYear &&
      data.semester &&
      data.credits > 0 &&
      data.maxCapacity > 0
    );
  };
  
  // Reset form data to initial values
  const resetFormData = () => {
    setFormData(initialFormState);
  };
  
  // Handle View Course
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsViewing(true);
    setIsEditing(false);
    setIsCreating(false);
    setIsAssigningTeacher(false);
  };
  
  // Handle opening the edit modal
  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    // Populate form with course data
    setFormData({
      courseName: course.courseName || '',
      courseCode: course.courseCode || '',
      courseDescription: course.courseDescription || '',
      courseCoordinator: course.courseCoordinator?._id || '',
      department: course.department?._id || '',
      academicYear: course.academicYear || '',
      semester: course.semester || '',
      credits: course.credits || 0,
      maxCapacity: course.maxCapacity || 0,
      isActive: course.isActive || false
    });
    setIsEditing(true);
    setIsViewing(false);
    setIsCreating(false);
    setIsAssigningTeacher(false);
  };
  
  // Handle Edit Course
  const handleEditCourse = async (e) => {
    e.preventDefault();
    if (selectedCourse && isValidFormData(formData)) {
      try {
        // Create a copy of the form data
        const updatedData = {...formData};
        
        // Convert empty coordinator string to null
        if (updatedData.courseCoordinator === '') {
          updatedData.courseCoordinator = null;
        }
        
        // Dispatch the update action
        await dispatch(updateCourse({ 
          courseId: selectedCourse._id, 
          courseData: updatedData 
        })).unwrap();
        
        setIsEditing(false);
        resetFormData();
      } catch (err) {
        console.error('Failed to update course:', err);
      }
    }
  };

  // Handle opening the assign teacher modal
  const handleOpenAssignTeacherModal = (course) => {
    setSelectedCourse(course);
    setIsAssigningTeacher(true);
    setIsViewing(false);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Handle Assign Teacher
  const handleAssignTeacher = async (data) => {
    try {
      await dispatch(assignTeacherToCourse(data)).unwrap();
      await dispatch(createClassroom(data)).unwrap();
      setIsAssigningTeacher(false);
    } catch (err) {
      console.error('Failed to assign teacher:', err);
    }
  };

  // Add new action to CourseCard component
  const courseActions = {
    onView: handleViewCourse,
    onEdit: handleOpenEditModal,
    onDelete: handleDeleteCourse,
    onAssignTeacher: handleOpenAssignTeacherModal
  };

  return (
    <div className={`p-6 ${colors.gradientBackground} min-h-screen`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${colors.gradient.text}`}>Course Management</h1>
        <p className={`${colors.secondaryText}`}>Manage your institution's courses, instructors, and students</p>
      </div>

      {/* Dashboard Charts */}
      <DashboardCharts courses={courses} colors={colors} />
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          colors={colors} 
        />
        
        <button
          className={`flex items-center py-2 px-4 rounded-lg ${colors.button.green}`}
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setIsViewing(false);
            setIsAssigningTeacher(false);
            setSelectedCourse(null);
            resetFormData();
          }}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Course
        </button>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className={`p-4 ${colors.card} rounded-lg mb-6 ${colors.text} text-center`}>
          Loading courses...
        </div>
      )}
      
      {/* Course Listing */}
      {!isLoading && (
        <CourseList 
          courses={filteredCourses} 
          onView={handleViewCourse}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCourse} 
          onAssignTeacher={handleOpenAssignTeacherModal}
          colors={colors} 
        />
      )}
      
      {/* Modals */}
      <CreateCourseModal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          resetFormData();
        }}
        onSubmit={handleCreateCourse}
        formData={formData}
        handleInputChange={handleFormInputChange}
        colors={colors}
        departments={departments}
        teachers={teachers}
      />
      
      <EditCourseModal
        isOpen={isEditing}
        course={selectedCourse}
        onClose={() => {
          setIsEditing(false);
          resetFormData();
        }}
        onSubmit={handleEditCourse}
        formData={formData}
        handleInputChange={handleFormInputChange}
        colors={colors}
        departments={departments}
        teachers={teachers}
      />
      
      <ViewCourseModal
        course={selectedCourse}
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        onEditClick={() => {
          handleOpenEditModal(selectedCourse);
          setIsViewing(false);
        }}
        colors={colors}
        departments={departments}
        teachers={teachers}
      />
  
      <AssignTeacherModal
        isOpen={isAssigningTeacher}
        onClose={() => setIsAssigningTeacher(false)}
        onSubmit={handleAssignTeacher}
        course={selectedCourse}
        groups={allGroups}
        teachers={teachers}
        colors={colors}
        isLoading={isLoading}
      />
    </div>
  );
}