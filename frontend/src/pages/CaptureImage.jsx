import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AutoFaceDetector from '../components/AutoFaceDetector';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import DotBackground from '../components/BackgroundDecorations';
import BackgroundDecorations from '../components/BackgroundDecorations';

// Updated color palette with provided hex codes
const colors = {
  // Primary colors
  primary: '#3c8ce5',
  primaryLight: '#5c98e8',
  primaryLighter: '#a0bdf1',
  primaryLightest: '#b4caf4',
  
  // Surface colors
  darkNavy: '#121212',
  charcoalGray: '#282828',
  mediumGray: '#717171',
  lightGray: '#8b8b8b',
  deepGray: '#3f3f3f',
  
  // Tonal surface colors
  tonalDark: '#191d24',
  tonalMediumDark: '#2e3239',
  tonalMedium: '#45484e',
  tonalMediumLight: '#5d5f65',
  tonalLight: '#75787d',
  tonalLightest: '#8f9195',
  
  // Accent colors (keeping these for status indicators)
  accentOrange: '#FF7E4F',
  accentGreen: '#35B778',
  
  // Text colors
  textLight: '#ffffff',
  textMedium: '#8f9195'
};

const CaptureImage = () => {
  const [status, setStatus] = useState('waiting'); 
  const [matchResult, setMatchResult] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [capturedFace, setCapturedFace] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    // This is a simplified check - replace with your actual auth check
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsAuthenticated(false);
      toast.error('Please sign in first to use facial recognition');
      // Redirect to signup page after a short delay
      setTimeout(() => {
        navigate('/signup');
      }, 3000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);
  
  const handleFaceEmbeddingGenerated = async (imageFile, embedding, faceImageUrl) => {
    // Only process if we're still in capturing mode
    if (!isCapturing) return;
    
    // Stop capturing as soon as we get a face embedding
    setIsCapturing(false);
    
    // Save the face image
    if (faceImageUrl) {
      setCapturedFace(faceImageUrl);
    }
    
    try {
      setStatus('processing');
      toast.info('Face detected! Sending to server for recognition...'); 
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/face-recognition/find-closest-match`, {
        embedding: JSON.stringify(embedding)
      });
      
      const result = response.data;
      console.log(result);
      
      setTimeout(() => {
        setMatchResult(result.match);

        setStatus(result.success ? 'success' : 'error');
        
        // Use toast instead of message
        if (result.success) {
          toast.success(`Welcome back, ${result.match.user.firstName} ${result.match.user.lastName}!`);
        } else {
          toast.error('Face not recognized. Please try again or register.');
        }
      }, 0);
      
    } catch (error) {
      console.error('Error during face recognition:', error);
      setStatus('error');
      toast.error(`Recognition failed: ${error.message}`);
    }
  };

  // Reset the process
  const handleReset = () => {
    setStatus('waiting');
    toast.info('Initializing face detection...'); 
    setMatchResult(null);
    setCapturedFace(null);
    setIsCapturing(true);
  };

  // Get background color based on status
  const getStatusBackgroundColor = () => {
    switch (status) {
      case 'waiting':
      case 'detecting':
        return colors.tonalMediumDark;
      case 'processing':
        return colors.primaryLight;
      case 'success':
        return colors.accentGreen;
      case 'error':
        return colors.accentOrange;
      default:
        return colors.tonalMediumDark;
    }
  };

  // Function to render user detail field
  const renderUserDetail = (label, value) => {
    return value ? (
      <div className="mb-2">
        <p className="text-sm" style={{ color: colors.textMedium }}>{label}:</p>
        <p className="font-medium text-sm" style={{ color: colors.textLight }}>
          {value}
        </p>
      </div>
    ) : null;
  };

  // Get status message based on current status
  const getStatusMessage = () => {
    switch (status) {
      case 'waiting':
        return 'Initializing face detection...';
      case 'detecting':
        return 'Looking for your face...';
      case 'processing':
        return 'Processing facial recognition...';
      case 'success':
        return matchResult ? `Welcome back, ${matchResult.user.firstName} ${matchResult.user.lastName}!` : 'Authentication successful';
      case 'error':
        return 'Face not recognized or error occurred.';
      default:
        return 'Waiting for input...';
    }
  };

  // If not authenticated, show minimal UI
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: colors.darkNavy }}>
        {/* Add the dot background */}
        <BackgroundDecorations colors={colors} density={0.5} />
        
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <div className="text-center p-8 rounded-lg shadow-xl relative z-10" style={{ backgroundColor: colors.deepGray }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textLight }}>
            Face Recognition
          </h1>
          <p className="mb-4" style={{ color: colors.textMedium }}>
            Please sign in to use the facial recognition system
          </p>
          <p style={{ color: colors.primary }}>
            Redirecting to signup page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen" style={{ backgroundColor: colors.darkNavy }}>
      {/* Add the dot background */}
      <DotBackground colors={colors} density={0.6} />
      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto p-2 relative z-10">
        <div className="text-center mb-2 pt-2">
          <h1 className="text-2xl font-bold" style={{ color: colors.textLight }}>
            Face Recognition
          </h1>
          <p className="text-sm" style={{ color: colors.textMedium }}>
            Look at the camera to automatically authenticate
          </p>
        </div>

        {/* Conditional rendering based on status - show one container at a time */}
        {(status === 'waiting' || status === 'detecting' || status === 'error') ? (
          /* Camera/Face Detection Container */
          <div className="max-w-xl mx-auto rounded-lg shadow-xl p-3" style={{ backgroundColor: colors.tonalDark }}>
            {/* Status indicator */}
            <div className="mb-3 p-2 rounded-lg text-center" 
              style={{ 
                backgroundColor: getStatusBackgroundColor(),
                color: colors.textLight,
                transition: 'background-color 0.3s ease'
              }}>
              <p className="font-medium  text-sm">{getStatusMessage()}</p>
            </div>

            {/* Face detector component */}
            {(status === 'waiting' || status === 'detecting') && (
              <div className="p-2 rounded-lg" style={{ backgroundColor: colors.tonalMediumDark }}>
                <AutoFaceDetector 
                  onEmbeddingGenerated={handleFaceEmbeddingGenerated}
                  autoCapture={isCapturing}
                  colors={colors}
                />
              </div>
            )}

            {/* Error state with retry button */}
            {status === 'error' && (
              <div className="text-center py-3">
                <p className="mb-3 text-sm" style={{ color: colors.textLight }}>
                  Face not recognized or error occurred.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: colors.primary, color: colors.textLight }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        ) : (
          /* User Details Container - shown during processing or success */
          <div className="max-w-xl mx-auto rounded-lg shadow-xl p-3" style={{ backgroundColor: colors.tonalDark }}>
            {/* Status indicator */}
            <div className="mb-3 p-2 rounded-lg text-center" 
              style={{ 
                backgroundColor: getStatusBackgroundColor(),
                color: colors.textLight,
                transition: 'background-color 0.3s ease'
              }}>
              <p className="font-medium text-sm">{getStatusMessage()}</p>
            </div>
            
            {status === 'success' && matchResult ? (
              <div className="flex flex-col py-2">
                <div className="flex items-start mb-3">
                  {/* User profile image */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mr-4" 
                    style={{ backgroundColor: colors.tonalMediumDark, border: `3px solid ${colors.accentGreen}` }}>
                    {/* Profile image container */}
                  </div>
                </div>
                
                <div className="w-full p-3 rounded-lg mb-3" style={{ backgroundColor: colors.tonalMediumDark }}>
                  <h2 className="text-lg font-bold mb-2" style={{ color: colors.textLight }}>
                    User Details
                  </h2>
                  
                  <div className="space-y-1">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-2">
                      {renderUserDetail("First Name", matchResult.user.firstName)}
                      {renderUserDetail("Last Name", matchResult.user.lastName)}
                      {renderUserDetail("Email", matchResult.user.email)}
                      {renderUserDetail("Role", matchResult.user.role)}
                      {renderUserDetail("Group", matchResult.user.group)}
                      {renderUserDetail("Roll Number", matchResult.user.rollNumber)}
                      {renderUserDetail("Mobile", matchResult.user.mobile)}
                    </div>
                    
                    {/* Address Information */}
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <h3 className="text-md font-medium mb-1" style={{ color: colors.textLight }}>Address</h3>
                      {renderUserDetail("Current", matchResult.user.currentAddress)}
                      {renderUserDetail("Permanent", matchResult.user.permanentAddress)}
                    </div>

                    {/* Status and Match Confidence */}
                    <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2">
                      <div>
                        <h3 className="text-md font-medium mb-1" style={{ color: colors.textLight }}>Status</h3>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: matchResult.user.present ? colors.accentGreen : colors.accentOrange }}
                          ></div>
                          <span className="text-sm" style={{ color: colors.textLight }}>
                            {matchResult.user.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Match Confidence */}
                      {matchResult.confidence && (
                        <div>
                          <h3 className="text-md font-medium mb-1" style={{ color: colors.textLight }}>Confidence</h3>
                          <p className="text-sm" style={{ color: colors.textLight }}>
                            {`${(matchResult.confidence * 100).toFixed(2)}%`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm self-center mt-2"
                  style={{ backgroundColor: colors.primary, color: colors.textLight }}
                >
                  Try Another Face
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                {/* Show captured face during processing */}
                {capturedFace && status === 'processing' && (
                  <div className="mb-4">
                    <h3 className="text-sm text-center mb-2" style={{ color: colors.textLight }}>Detected Face</h3>
                    <div className="w-32 h-32 overflow-hidden rounded-lg mx-auto" 
                      style={{ border: `2px solid ${colors.primary}` }}>
                      {/* <img 
                        src={capturedFace} 
                        alt="Detected Face" 
                        className="w-full h-full object-cover"
                      /> */}
                    </div>
                  </div>
                )}
                
                <div className="text-center p-3">
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    Processing facial recognition...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-2">
          <p style={{ color: colors.textMedium, fontSize: '0.7rem' }}>
            Secure facial authentication system
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptureImage;