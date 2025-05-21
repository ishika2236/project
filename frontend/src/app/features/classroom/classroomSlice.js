import { createSlice } from '@reduxjs/toolkit';
import { 
  createClassroom,
  getAllClassrooms,
  getClassroomsByDepartment,
  getClassroomsByCourse,
  getClassroomsByGroup,
  getClassroomsByTeacher,
  getClassroomById,
  getClassroomStudents,
  updateClassroom,
  updateTeacher,
  updateGroup,
  updateCourse,
  deleteClassroom,
  uploadMaterial,
  fetchAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
  postAnnouncement,
  deleteMaterial,
  getClassroomsByStudent
} from './classroomThunks';

const initialState = {
  classrooms: [],
  departmentClassrooms: [],
  courseClassrooms: [],
  groupClassrooms: [],
  teacherClassrooms: [],
  studentClassrooms: [],
  currentClassroom: null,
  classroomStudents: [],
  classroomAnnouncements: [],
  sharedMaterials: {
    teacher: [],  // Materials visible to teachers
    admin: [],    // Materials visible to admins
    department: [] // Materials visible by department
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentClassroom: (state) => {
      state.currentClassroom = null;
    },
    clearClassroomAnnouncements: (state) => {
      state.classroomAnnouncements = [];
    },
    // New reducer to process shared materials based on role
    processSharedMaterials: (state, action) => {
      const { role, materials } = action.payload;
      if (role === 'teacher') {
        state.sharedMaterials.teacher = materials;
      } else if (role === 'admin') {
        state.sharedMaterials.admin = materials;
      } else if (role === 'department') {
        state.sharedMaterials.department = materials;
      }
    },
    // Clear shared materials
    clearSharedMaterials: (state) => {
      state.sharedMaterials = {
        teacher: [],
        admin: [],
        department: []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Create classroom
      .addCase(createClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classrooms.push(action.payload.classroom);
        state.currentClassroom = action.payload.classroom;
        
        // Process any shared materials from the new classroom
        if (action.payload.classroom.sharedResources && action.payload.classroom.sharedResources.length > 0) {
          // Store materials by role (assuming you have a way to determine the current role)
          // For demonstration, adding to all roles
          state.sharedMaterials.teacher.push(...action.payload.classroom.sharedResources);
          state.sharedMaterials.admin.push(...action.payload.classroom.sharedResources);
          state.sharedMaterials.department.push(...action.payload.classroom.sharedResources);
        }
        
        state.message = 'Classroom created successfully';
      })
      .addCase(createClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get all classrooms
      .addCase(getAllClassrooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllClassrooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classrooms = action.payload;
        
        // Process shared materials from all classrooms
        const allMaterials = [];
        if (Array.isArray(action.payload)) {
          action.payload.forEach(classroom => {
            if (classroom.sharedResources && classroom.sharedResources.length > 0) {
              allMaterials.push(...classroom.sharedResources);
            }
          });
          
          // Store materials by role (assuming current role)
          // For demonstration, storing in all roles
          state.sharedMaterials.teacher = [...allMaterials];
          state.sharedMaterials.admin = [...allMaterials];
          state.sharedMaterials.department = [...allMaterials];
        }
      })
      .addCase(getAllClassrooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classrooms by department
      .addCase(getClassroomsByDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomsByDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.departmentClassrooms = action.payload;
        
        // Process shared materials for department view
        const departmentMaterials = [];
        if (Array.isArray(action.payload)) {
          action.payload.forEach(classroom => {
            if (classroom.sharedResources && classroom.sharedResources.length > 0) {
              departmentMaterials.push(...classroom.sharedResources);
            }
          });
        
          // Store materials in department role specifically
          state.sharedMaterials.department = [...departmentMaterials];
        }
      })
      .addCase(getClassroomsByDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classrooms by course
      .addCase(getClassroomsByCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomsByCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courseClassrooms = action.payload;
        
        // Process materials for potential admin view
        if (action.meta && action.meta.arg && action.meta.arg.role === 'admin' && Array.isArray(action.payload)) {
          const courseMaterials = [];
          action.payload.forEach(classroom => {
            if (classroom.sharedResources && classroom.sharedResources.length > 0) {
              courseMaterials.push(...classroom.sharedResources);
            }
          });
          
          state.sharedMaterials.admin = [...courseMaterials];
        }
      })
      .addCase(getClassroomsByCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classrooms by group
      .addCase(getClassroomsByGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomsByGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groupClassrooms = action.payload;
      })
      .addCase(getClassroomsByGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classrooms by teacher
      .addCase(getClassroomsByTeacher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomsByTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload)
        state.teacherClassrooms = action.payload;
        
        // Process materials for teacher view
        const teacherMaterials = [];
        if (Array.isArray(action.payload)) {
          action.payload.forEach(classroom => {
            if (classroom.sharedResources && classroom.sharedResources.length > 0) {
              teacherMaterials.push(...classroom.sharedResources);
            }
          });
        
          // Store materials in teacher role specifically
          state.sharedMaterials.teacher = [...teacherMaterials];
        }
      })
      .addCase(getClassroomsByTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classrooms by student
      .addCase(getClassroomsByStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomsByStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentClassrooms = action.payload;
        
        // Process materials for student view if applicable
        const studentMaterials = [];
        if (Array.isArray(action.payload)) {
          action.payload.forEach(classroom => {
            if (classroom.sharedResources && classroom.sharedResources.length > 0) {
              studentMaterials.push(...classroom.sharedResources);
            }
          });
        }
      })
      .addCase(getClassroomsByStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classroom by ID
      .addCase(getClassroomById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClassroom = action.payload;
        
        // If classroom has shared resources, store them in current view's materials
        if (action.payload && action.payload.sharedResources && action.payload.sharedResources.length > 0) {
          // Store based on current role (assuming role is passed in meta data)
          const role = action.meta && action.meta.arg && action.meta.arg.role ? action.meta.arg.role : 'teacher'; // Default to teacher if not specified
          
          if (role === 'teacher') {
            state.sharedMaterials.teacher = [...action.payload.sharedResources];
          } else if (role === 'admin') {
            state.sharedMaterials.admin = [...action.payload.sharedResources];
          } else if (role === 'department') {
            state.sharedMaterials.department = [...action.payload.sharedResources];
          }
        }
      })
      .addCase(getClassroomById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get classroom students
      .addCase(getClassroomStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassroomStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomStudents = action.payload;
      })
      .addCase(getClassroomStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update classroom
      .addCase(updateClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClassroom = action.payload.classroom;
        state.classrooms = state.classrooms.map((c) => 
          c._id === action.payload.classroom._id ? action.payload.classroom : c
        );
        
        // Update shared materials if applicable
        if (action.payload.classroom && action.payload.classroom.sharedResources) {
          // Update based on role (from meta data or context)
          const role = action.meta && action.meta.arg && action.meta.arg.role ? action.meta.arg.role : 'teacher';
          
          if (role === 'teacher') {
            // Update teacher materials that belong to this classroom
            const otherClassroomMaterials = state.sharedMaterials.teacher.filter(
              material => !material.classroomId || material.classroomId !== action.payload.classroom._id
            );
            state.sharedMaterials.teacher = [
              ...otherClassroomMaterials,
              ...action.payload.classroom.sharedResources
            ];
          } else if (role === 'admin') {
            // Similar logic for admin
            const otherClassroomMaterials = state.sharedMaterials.admin.filter(
              material => !material.classroomId || material.classroomId !== action.payload.classroom._id
            );
            state.sharedMaterials.admin = [
              ...otherClassroomMaterials,
              ...action.payload.classroom.sharedResources
            ];
          } else if (role === 'department') {
            // Similar logic for department
            const otherClassroomMaterials = state.sharedMaterials.department.filter(
              material => !material.classroomId || material.classroomId !== action.payload.classroom._id
            );
            state.sharedMaterials.department = [
              ...otherClassroomMaterials,
              ...action.payload.classroom.sharedResources
            ];
          }
        }
        
        state.message = 'Classroom updated successfully';
      })
      .addCase(updateClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update classroom teacher
      .addCase(updateTeacher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClassroom = action.payload.classroom;
        state.classrooms = state.classrooms.map((c) => 
          c._id === action.payload.classroom._id ? action.payload.classroom : c
        );
        state.message = 'Teacher updated successfully';
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update classroom group
      .addCase(updateGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClassroom = action.payload.classroom;
        state.classrooms = state.classrooms.map((c) => 
          c._id === action.payload.classroom._id ? action.payload.classroom : c
        );
        state.message = 'Group updated successfully';
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update classroom course
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClassroom = action.payload.classroom;
        state.classrooms = state.classrooms.map((c) => 
          c._id === action.payload.classroom._id ? action.payload.classroom : c
        );
        state.message = 'Course updated successfully';
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete classroom
      .addCase(deleteClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classrooms = state.classrooms.filter((c) => c._id !== action.meta.arg);
        state.currentClassroom = null;
        
        // Remove shared materials related to this classroom
        if (action.meta && action.meta.arg && action.meta.arg.classroomId) {
          const classroomId = action.meta.arg.classroomId;
          
          // Remove from all role views
          state.sharedMaterials.teacher = state.sharedMaterials.teacher.filter(
            material => !material.classroomId || material.classroomId !== classroomId
          );
          
          state.sharedMaterials.admin = state.sharedMaterials.admin.filter(
            material => !material.classroomId || material.classroomId !== classroomId
          );
          
          state.sharedMaterials.department = state.sharedMaterials.department.filter(
            material => !material.classroomId || material.classroomId !== classroomId
          );
        }
        
        state.message = 'Classroom deleted successfully';
      })
      .addCase(deleteClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Upload Material
      .addCase(uploadMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update current classroom materials if needed
        if (state.currentClassroom && state.currentClassroom._id === action.meta.arg.classroomId) {
          if (!state.currentClassroom.sharedResources) {
            state.currentClassroom.sharedResources = [];
          }
          
          state.currentClassroom = {
            ...state.currentClassroom,
            sharedResources: [...state.currentClassroom.sharedResources, action.payload.material]
          };
        }
        
        // Add the material to appropriate role-based storage
        const roles = action.meta && action.meta.arg && action.meta.arg.visibleTo ? action.meta.arg.visibleTo : ['teacher', 'admin', 'department'];
        
        if (roles.includes('teacher')) {
          state.sharedMaterials.teacher.push(action.payload.material);
        }
        
        if (roles.includes('admin')) {
          state.sharedMaterials.admin.push(action.payload.material);
        }
        
        if (roles.includes('department')) {
          state.sharedMaterials.department.push(action.payload.material);
        }
        
        state.message = 'Material uploaded successfully';
      })
      .addCase(uploadMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Fetch Announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomAnnouncements = action.payload || [];
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Edit Announcement
      .addCase(editAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomAnnouncements = state.classroomAnnouncements.map(
          (announcement) => announcement._id === action.payload.announcement._id 
            ? action.payload.announcement 
            : announcement
        );
        state.message = 'Announcement updated successfully';
      })
      .addCase(editAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomAnnouncements = state.classroomAnnouncements.filter(
          (announcement) => announcement._id !== (action.meta && action.meta.arg ? action.meta.arg.announcementId : null)
        );
        state.message = 'Announcement deleted successfully';
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Post Announcement
      .addCase(postAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classroomAnnouncements = [
          action.payload.announcement,
          ...state.classroomAnnouncements
        ];
        state.message = 'Announcement posted successfully';
      })
      .addCase(postAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Material
      .addCase(deleteMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update current classroom materials if needed
        if (state.currentClassroom && state.currentClassroom.sharedResources) {
          state.currentClassroom = {
            ...state.currentClassroom,
            sharedResources: (state.currentClassroom.sharedResources || []).filter(
              (material) => material._id !== (action.meta && action.meta.arg ? action.meta.arg.resourceId : null)
            )
          };
        }
        
        // Remove the material from all role-based storages
        const resourceId = action.meta && action.meta.arg ? action.meta.arg.resourceId : null;
        
        if (resourceId) {
          state.sharedMaterials.teacher = state.sharedMaterials.teacher.filter(
            material => material._id !== resourceId
          );
          
          state.sharedMaterials.admin = state.sharedMaterials.admin.filter(
            material => material._id !== resourceId
          );
          
          state.sharedMaterials.department = state.sharedMaterials.department.filter(
            material => material._id !== resourceId
          );
        }
        
        state.message = 'Material deleted successfully';
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { 
  reset, 
  clearCurrentClassroom, 
  clearClassroomAnnouncements,
  processSharedMaterials,
  clearSharedMaterials
} = classroomSlice.actions;
export default classroomSlice.reducer;