// Main Component: CourseManagement.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { useAuth } from '../../context/AuthProvider';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCourses, createCourse , updateCourse, deleteCourse} from '../../app/features/courses/courseThunks';

import DashboardCharts from '../../components/admin/courseManagement/DashboardCharts';
import SearchBar from '../../components/admin/courseManagement/SearchBar';
import CourseList from '../../components/admin/courseManagement/courseList';
import EditCourseModal from '../../components/admin/courseManagement/ModalComponents/EditCourseModal';
import ViewCourseModal from '../../components/admin/courseManagement/ModalComponents/ViewCourseModal';
import CreateCourseModal from '../../components/admin/courseManagement/ModalComponents/CreateCourseModal';

export default function CourseManagement() {
  const { user } = useAuth();
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    courseDescription: '',
    courseCoordinator: null,
    department: '',
    academicYear: '',
    semester: '',
    credits: 0,
    maxCapacity: 0,
    isActive: false
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  
  const dispatch = useDispatch();
  
  const { courses = [], isLoading = false, error = null } = useSelector(state => state.courses || {});

  useEffect(() => {
    dispatch(fetchAdminCourses());
  }, [dispatch]);

  // Handle search functionality
  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Create Course
  const handleCreateCourse = async () => {
    if (isValidFormData(formData)) {
      try {
        dispatch(createCourse(formData));  
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
        dispatch(deleteCourse(courseId));  
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
      data.department &&
      data.academicYear &&
      data.semester &&
      data.credits > 0 &&
      data.maxCapacity > 0
    );
  };
  // Reset form data to initial values
  const resetFormData = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      courseDescription: '',
      courseCoordinator: null,
      department: '',
      academicYear: '',
      semester: '',
      credits: 0,
      maxCapacity: 0,
      isActive: false
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  // Modify the handleViewCourse function to:
const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsViewing(true);
    setIsEditing(false);
    setIsCreating(false);
  };
  
  // Add a function to handle opening the edit modal
  const handleOpenEditModal = (course) => {
  setSelectedCourse(course);
  // Populate form with course data
  setFormData({
    courseName: course.courseName || '',
    courseCode: course.courseCode || '',
    courseDescription: course.courseDescription || '',
    courseCoordinator: course.courseCoordinator?.name || '',
    department: course.department || '',
    academicYear: course.academicYear || '',
    semester: course.semester || '',
    credits: course.credits || 0,
    maxCapacity: course.maxCapacity || 0,
    isActive: course.isActive || false
  });
  setIsEditing(true);
  setIsViewing(false);
  setIsCreating(false);
};
const handleEditCourse = async () => {
    if (selectedCourse && isValidFormData(formData)) {
      try {
        // Create a copy of the form data
        const updatedData = {...formData};
        
        // Convert empty coordinator string to null
        if (updatedData.courseCoordinator === '') {
          updatedData.courseCoordinator = null;
        }
        
        // Dispatch the update action
        dispatch(updateCourse({ 
          courseId: selectedCourse._id, 
          courseData: updatedData 
        }));
        
        setIsEditing(false);
        resetFormData();
      } catch (err) {
        console.error('Failed to update course:', err);
      }
    }
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
            setSelectedCourse(null);
            resetFormData();
          }}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Course
        </button>
      </div>
      
      {/* Course Listing */}
      <CourseList 
        courses={filteredCourses} 
        onView={handleViewCourse}  
        onEdit={handleOpenEditModal}  // Changed from handleEditCourse to handleOpenEditModal
        onDelete={handleDeleteCourse} 
        colors={colors} 
        />
      
      {/* Modals */}
      <CreateCourseModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateCourse}
        formData={formData}
        handleInputChange={handleInputChange}
        colors={colors}
      />
      
      <EditCourseModal
        isOpen={isEditing}
        course={selectedCourse}
        onClose={() => setIsEditing(false)}
        onSubmit={handleEditCourse}
        formData={formData}
        handleInputChange={handleInputChange}
        colors={colors}
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
        />
    </div>
  );
}
