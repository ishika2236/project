
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod'; // Import Zod

// Import Redux actions
import { register, getDepartments } from '../../app/features/auth/authThunks';
import { reset } from '../../app/features/auth/authSlice';

// Import context (keeping ThemeProvider)
import { useTheme } from './../../context/ThemeProvider';

// Import separated components
import BackgroundDecorations from './../../components/BackgroundDecorations';
import ProgressBar from './../../components/ProgressBar';
import RoleSelectionStep from './../../components/RoleSelectionStep';
import BasicInfoStep from './../../components/BasicInfoStep';
import AddressInfoStep from './../../components/AddressInfoStep';
import RoleSpecificInfoStep from './../../components/RoleSpecificInfoStep';
import SocialLoginButtons from './../../components/SocialLoginButtons';
import ThemeToggle from './../../components/ThemeToggle';

// Define Zod schemas for validation
const emailSchema = z.string().email('Please enter a valid email address');

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

const confirmPasswordSchema = (password) => z.string()
  .refine((value) => value === password, {
    message: 'Passwords do not match',
  });

const mobileSchema = z.string()
  .regex(/^\d{10}$/, 'Mobile number must be 10 digits');

const pincodeSchema = z.string()
  .regex(/^\d{6}$/, 'Pincode must be 6 digits');

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: pincodeSchema,
  country: z.string().min(1, 'Country is required'),
});

const baseUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(), // Will be refined with confirmPasswordSchema
  mobile: mobileSchema,
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  role: z.string().min(1, 'Role is required'),
  permanentAddress: addressSchema,
  currentAddress: addressSchema,
});

// Role-specific schemas
const studentSchema = baseUserSchema.extend({
  rollNumber: z.string().min(1, 'Roll number is required'),
  admissionYear: z.string().min(4, 'Please enter a valid admission year'),
  group: z.string().min(1, 'Group is required'),
});

const teacherSchema = baseUserSchema.extend({
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme, themeConfig, getThemedClass } = useTheme();
  
  // Get auth state from Redux
  const { isLoading: isSubmitting, isSuccess, isError, message, departments } = useSelector(
    (state) => state.auth
  );
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(null);

  useEffect(() => {
    if (!departments || departments.length === 0) {
      setIsDepartmentsLoading(true);
      dispatch(getDepartments())
        .unwrap()
        .then((result) => {
          console.log("Departments fetched successfully:", result);
          setIsDepartmentsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
          setDepartmentsError(error.message || "Failed to load departments");
          setIsDepartmentsLoading(false);
  
          toast.error("Failed to load departments data. Please try again later.", {
            position: "top-right",
            autoClose: 5000,
          });
        });
    } else {
      // Departments already exist, no need to fetch again
      console.log("Departments already available:", departments);
      setIsDepartmentsLoading(false);
    }
  }, [dispatch, departments]);
  

  // Debug departments when they change
  useEffect(() => {
    console.log("Departments updated in Signup:", departments);
  }, [departments]);
  
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    mobile: '', 
    dateOfBirth: '', 
    gender: '', 
    role: '',
    permanentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
    currentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
    // Student-specific fields
    rollNumber: '', 
    admissionYear: '', 
    group: '', 
    // Teacher-specific fields
    employeeId: '',
    department: ''
  });
  
  // New validation state structure using Zod
  const [errors, setErrors] = useState({});

  // Reset the auth state on component unmount
  React.useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Handle successful registration
  React.useEffect(() => {
    if (isSuccess) {
      // Show success toast
      toast.success('Registration Successful! Redirecting to Dashboard...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to dashboard after toast
      setTimeout(() => {
        const role = formData.role;
        if(role === "student")
          navigate('/student/dashboard');
        else
          navigate('/teacher/dashboard');
      }, 2500);
      
      // Reset the success state
      dispatch(reset());
    }
    
    if (isError) {
      toast.error(message || 'Registration Failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Reset the error state
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, navigate, formData.role]);

  // Validate a single field
  const validateField = (name, value) => {
    try {
      if (name.includes('.')) {
        // Handle nested fields (address)
        const [parent, child] = name.split('.');
        const schema = addressSchema.shape[child];
        schema.parse(value);
        
        // Clear error for this field if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[parent] && newErrors[parent][child]) {
            delete newErrors[parent][child];
            if (Object.keys(newErrors[parent]).length === 0) {
              delete newErrors[parent];
            }
          }
          return newErrors;
        });
      } else {
        // Handle different types of fields
        let schema;
        switch (name) {
          case 'email':
            schema = emailSchema;
            break;
          case 'password':
            schema = passwordSchema;
            break;
          case 'confirmPassword':
            schema = confirmPasswordSchema(formData.password);
            break;
          case 'mobile':
            schema = mobileSchema;
            break;
          default:
            // For other fields, just check they're not empty
            schema = z.string().min(1, `${name} is required`);
        }
        
        schema.parse(value);
        
        // Clear error for this field if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      return true;
    } catch (error) {
      // Set validation error
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setErrors(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent] || {}),
            [child]: error.errors[0].message
          }
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message
        }));
      }
      return false;
    }
  };

  // Validate form for the current step
  const validateStep = () => {
    let isValid = true;
    let newErrors = {};

    switch (step) {
      case 1: // Basic Info
        try {
          // Validate only the fields in this step
          const basicInfoSchema = z.object({
            firstName: z.string().min(1, 'First name is required'),
            lastName: z.string().min(1, 'Last name is required'),
            email: emailSchema,
            password: passwordSchema,
            confirmPassword: z.string(),
            mobile: mobileSchema,
            dateOfBirth: z.string().min(1, 'Date of birth is required'),
            gender: z.string().min(1, 'Gender is required'),
          }).refine(data => data.confirmPassword === data.password, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
          });
          
          basicInfoSchema.parse(formData);
        } catch (error) {
          isValid = false;
          error.errors.forEach(err => {
            newErrors = { ...newErrors, [err.path[0]]: err.message };
          });
        }
        break;
        
      case 2: // Address Info
        try {
          const addressInfoSchema = z.object({
            permanentAddress: addressSchema,
            currentAddress: addressSchema,
          });
          
          addressInfoSchema.parse({
            permanentAddress: formData.permanentAddress,
            currentAddress: formData.currentAddress,
          });
        } catch (error) {
          isValid = false;
          error.errors.forEach(err => {
            if (err.path.length === 2) {
              // Handle nested errors (e.g., permanentAddress.street)
              const [parent, child] = err.path;
              newErrors = {
                ...newErrors,
                [parent]: {
                  ...(newErrors[parent] || {}),
                  [child]: err.message
                }
              };
            }
          });
        }
        break;
        
      case 3: // Role-specific Info
        try {
          if (role === 'student') {
            // Only validate student-specific fields
            const studentSpecificSchema = z.object({
              rollNumber: z.string().min(1, 'Roll number is required'),
              admissionYear: z.string().min(4, 'Please enter a valid admission year'),
              group: z.string().min(1, 'Group is required'),
            });
            
            studentSpecificSchema.parse(formData);
          } else if (role === 'teacher') {
            // Only validate teacher-specific fields
            const teacherSpecificSchema = z.object({
              employeeId: z.string().min(1, 'Employee ID is required'),
              department: z.string().min(1, 'Department is required'),
            });
            
            teacherSpecificSchema.parse(formData);
          }
        } catch (error) {
          isValid = false;
          error.errors.forEach(err => {
            newErrors = { ...newErrors, [err.path[0]]: err.message };
          });
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate entire form before final submission
  const validateForm = () => {
    try {
      // Choose schema based on role
      const schema = role === 'student' ? studentSchema : teacherSchema;
      
      // Add refine for password confirmation
      const fullSchema = schema.refine(data => data.confirmPassword === data.password, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
      
      fullSchema.parse(formData);
      return true;
    } catch (error) {
      // Process and set all validation errors
      const newErrors = {};
      
      error.errors.forEach(err => {
        if (err.path.length === 1) {
          newErrors[err.path[0]] = err.message;
        } else if (err.path.length === 2) {
          // Handle nested errors (address)
          const [parent, child] = err.path;
          newErrors[parent] = {
            ...(newErrors[parent] || {}),
            [child]: err.message
          };
        }
      });
      
      setErrors(newErrors);
      
      // Show toast for validation errors
      toast.error('Please fix the validation errors before submitting', {
        position: "top-right",
        autoClose: 3000,
      });
      
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Validate the field as it changes
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler for camera-captured images
  const handleImageCapture = (imageFile, embedding) => {
    setProfileImage(imageFile);
    setProfileImagePreview(imageFile ? URL.createObjectURL(imageFile) : null);
    setFaceEmbedding(embedding);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ ...formData, role: selectedRole });
    
    // Pre-fetch departments if not already loaded when role is selected
    if ((!departments || departments.length === 0) && !isDepartmentsLoading) {
      setIsDepartmentsLoading(true);
      dispatch(getDepartments())
        .then(() => setIsDepartmentsLoading(false))
        .catch(() => {
          setIsDepartmentsLoading(false);
          toast.error("Failed to load departments data. Please try again later.");
        });
    }
    
    setStep(1);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateStep()) {
      toast.error('Please fix the validation errors before proceeding', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    // If moving to the role-specific step (step 3) and role is teacher or student
    // ensure departments are loaded
    if (step === 2 && (role === 'teacher' || role === 'student')) {
      if (!departments || departments.length === 0) {
        if (!isDepartmentsLoading) {
          // If not currently loading, try fetching again
          setIsDepartmentsLoading(true);
          dispatch(getDepartments())
            .then(() => {
              setIsDepartmentsLoading(false);
              setStep(prevStep => prevStep + 1);
            })
            .catch(() => {
              setIsDepartmentsLoading(false);
              toast.error("Failed to load departments data. Please try again later.");
            });
          return;
        }
        // If already loading, just show a toast
        toast.info("Please wait while departments data is loading...");
        return;
      }
    }
    
    setStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => setStep(step - 1);
  
  const handleSameAddressCheck = (e) => {
    if (e.target.checked) {
      const newCurrentAddress = { ...formData.permanentAddress };
      setFormData({
        ...formData,
        currentAddress: newCurrentAddress
      });
      
      // Clear any validation errors for current address
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.currentAddress;
        return newErrors;
      });
    } else {
      setFormData({
        ...formData,
        currentAddress: { street: '', city: '', state: '', pincode: '', country: '' }
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the entire form before submission
    if (!validateForm()) {
      return;
    }
    
    // Create form data including profile image and face embedding
    const registrationData = new FormData();
    
    // Add all regular form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !(value instanceof File)) {
        registrationData.append(key, JSON.stringify(value));
      } else {
        registrationData.append(key, value);
      }
    });
    
    // Add profile image and face embedding
    if (profileImage) {
      registrationData.append('profileImage', profileImage);
    }
    
    if (faceEmbedding) {
      registrationData.append('faceEmbedding', JSON.stringify(faceEmbedding));
    }
    
    // Dispatch the register action with the form data
    dispatch(register(registrationData));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <RoleSelectionStep 
            handleRoleSelect={handleRoleSelect} 
            getThemedClass={getThemedClass}
            theme={theme}
          />
        );
      
      case 1:
        return (
          <BasicInfoStep 
            formData={formData}
            handleChange={handleChange}
            errors={errors} // Pass the new errors object
            nextStep={nextStep}
            prevStep={prevStep}
            getThemedClass={getThemedClass}
            theme={theme}
          />
        );
      
      case 2:
        return (
          <AddressInfoStep 
            formData={formData}
            handleChange={handleChange}
            errors={errors} // Pass the new errors object
            handleSameAddressCheck={handleSameAddressCheck}
            nextStep={nextStep}
            prevStep={prevStep}
            getThemedClass={getThemedClass}
            theme={theme}
            setErrors={setErrors}
          />
        );
      
      case 3:
        console.log("departments in case: ", departments);
        return (
          <RoleSpecificInfoStep 
            formData={formData}
            handleChange={handleChange}
            errors={errors} // Pass the new errors object
            handleImageChange={handleImageChange}
            profileImagePreview={profileImagePreview}
            setProfileImage={setProfileImage}
            setProfileImagePreview={setProfileImagePreview}
            role={role}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            theme={theme}
            setFaceEmbedding={setFaceEmbedding}
            departments={departments || []}
            isDepartmentsLoading={isDepartmentsLoading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex w-screen h-screen ${theme === 'dark' ? themeConfig.dark.background : themeConfig.light.background}`}>
      {/* Toast Container */}
      <ToastContainer 
        theme={theme === 'dark' ? 'dark' : 'light'}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BackgroundDecorations theme={theme} />
      
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      {/* Left side content */}
      <div className={`relative w-3/10 p-6 flex flex-col justify-center z-10 ${theme === 'dark' ? '' : theme === 'dark' ? themeConfig.dark.gradientBackground : 'bg-gradient-to-br from-[#2E4053] to-[#1C2833]'}`}>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? themeConfig.dark.text : themeConfig.light.text} mb-2`}>Welcome to Platform</h1>
        <p className={`${theme === 'dark' ? themeConfig.dark.secondaryText : themeConfig.light.secondaryText} mb-4`}>
          Already have an account? 
          <span 
            className={`${theme === 'dark' ? 'text-green-400' : 'text-[#2E4053]'} font-medium cursor-pointer ml-1 hover:underline`}
            onClick={() => navigate('/login')}
          >
            Sign in
          </span>
        </p>
        
        {/* <SocialLoginButtons getThemedClass={getThemedClass} /> */}
        
        {/* Add accent element for light theme only */}
        {theme !== 'dark' && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#2E4053]"></div>
        )}
      </div>
      
      {/* Right side form */}
      <div className={`relative w-7/10 ${theme === 'dark' ? 'bg-slate-800/30' : themeConfig.light.gradientBackground} backdrop-blur-sm p-6 flex flex-col items-center justify-center z-10`}>
        {theme !== 'dark' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1C2833] to-[#2E4053]"></div>
        )}
        
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? themeConfig.dark.text : themeConfig.light.text}`}>Registration</h2>
            <p className={`text-sm ${theme === 'dark' ? themeConfig.dark.secondaryText : themeConfig.light.secondaryText} mt-2 max-w-md mx-auto`}>
              Join our platform to access all features and connect with students and teachers from around the world.
            </p>
          </div>
          
          <ProgressBar step={step} totalSteps={4} getThemedClass={getThemedClass} theme={theme} />
          
          <form className="w-full">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;