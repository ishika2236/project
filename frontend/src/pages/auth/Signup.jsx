import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import contexts
import { useAuth } from './../../context/AuthProvider';
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

const Signup = () => {
  const navigate = useNavigate();
  const { register, validateField } = useAuth();
  const { theme, toggleTheme, themeConfig, getThemedClass } = useTheme();
  
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const [validation, setValidation] = useState({
    email: null,
    password: null,
    confirmPassword: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Use validation from AuthContext
      if (name === 'email' || name === 'password' || name === 'confirmPassword') {
        setValidation({
          ...validation, 
          [name]: validateField(name, value)
        });
        
        // Update confirmPassword validation when password changes
        if (name === 'password' && formData.confirmPassword) {
          setValidation({
            ...validation,
            password: validateField('password', value),
            confirmPassword: formData.confirmPassword === value
          });
        }
      }
    }
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
    setStep(1);
  };

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => setStep(step - 1);
  
  const handleSameAddressCheck = (e) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        currentAddress: { ...formData.permanentAddress }
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
    setIsSubmitting((value) => true);
    
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
    
    try {
      const result = await register(registrationData);
      if (result.success) {
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
      } else {
        // Show error toast if registration fails
        toast.error(result.message || 'Registration Failed. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      // Show error toast for network or unexpected errors
      toast.error('An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different steps based on current step
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
            validation={validation}
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
            handleSameAddressCheck={handleSameAddressCheck}
            nextStep={nextStep}
            prevStep={prevStep}
            getThemedClass={getThemedClass}
            theme={theme}
          />
        );
      
      case 3:
        return (
          <RoleSpecificInfoStep 
            formData={formData}
            handleChange={handleChange}
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
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex w-screen h-screen ${themeConfig.background}`}>
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
      <div className={`relative w-3/10 p-6 flex flex-col justify-center z-10 ${theme === 'dark' ? '' : 'bg-gradient-to-br from-gray-800 to-black/80'}`}>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? themeConfig.text : 'text-white'} mb-2`}>Welcome to Platform</h1>
        <p className={`${theme === 'dark' ? themeConfig.secondaryText : 'text-[#a8dadc]'} mb-4`}>
          Already have an account? 
          <span 
            className={`${theme === 'dark' ? 'text-green-400' : 'text-[#e63946]'} font-medium cursor-pointer ml-1 hover:underline`}
            onClick={() => navigate('/login')}
          >
            Sign in
          </span>
        </p>
        
        <SocialLoginButtons getThemedClass={getThemedClass} />
        
        {/* Add accent element for light theme only */}
        {theme !== 'dark' && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#e63946]"></div>
        )}
      </div>
      
      {/* Right side form */}
      <div className={`relative w-7/10 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-100'} backdrop-blur-sm p-6 flex flex-col items-center justify-center z-10`}>
        {theme !== 'dark' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1d3557] to-[#e63946]"></div>
        )}
        
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1d3557]'}`}>Registration</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#457b9d]'} mt-2 max-w-md mx-auto`}>
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