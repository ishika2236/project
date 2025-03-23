import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    mobile: '', dateOfBirth: '', gender: '', role: '',
    permanentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
    currentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
    rollNumber: '', admissionYear: '', group: '', employeeId: ''
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
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsDataURL(file);
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
    setIsSubmitting(true);
    
    // Include profile image in form data
    const registrationData = {
      ...formData,
      profileImage
    };
    
    try {
      const result = await register(registrationData);
      if (result.success) {
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
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
            role={role}
            formData={formData}
            handleChange={handleChange}
            profileImage={profileImage}
            profileImagePreview={profileImagePreview}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            setProfileImage={setProfileImage}
            setProfileImagePreview={setProfileImagePreview}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            getThemedClass={getThemedClass}
            theme={theme}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex w-screen h-screen ${themeConfig.background}`}>
      <BackgroundDecorations theme={theme} />
      
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      {/* Left side content */}
      <div className="relative w-3/10 p-6 flex flex-col justify-center z-10">
        <h1 className={`text-3xl font-bold ${themeConfig.text} mb-2`}>Welcome to Platform</h1>
        <p className={`${themeConfig.secondaryText} mb-4`}>
          Already have an account? 
          <span 
            className="text-green-400 cursor-pointer ml-1"
            onClick={() => navigate('/login')}
          >
            Sign in
          </span>
        </p>
        
        <SocialLoginButtons getThemedClass={getThemedClass} />
      </div>
      
      {/* Right side form */}
      <div className="relative w-7/10 bg-slate-800/30 backdrop-blur-sm p-6 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">Registration</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
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