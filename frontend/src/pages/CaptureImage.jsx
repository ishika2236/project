import React, { useState } from 'react';
import AutoFaceDetector from '../components/AutoFaceDetector';
import axios from 'axios';

// Custom color palette
const colors = {
  delftBlue: '#2A3752',
  raisinBlack: '#171625',
  zomp: '#53AB94',
  oxfordBlue: '#1C2537',
  burgundy: '#8B242D',
  powderBlue: '#B4C0D8',
  gray: '#7D818A'
};

const CaptureImage = () => {
  const [status, setStatus] = useState('waiting'); 
  const [message, setMessage] = useState('Initializing face detection...');
  const [matchResult, setMatchResult] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [capturedFace, setCapturedFace] = useState(null);
  
 
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
      setMessage('Face detected! Sending to server for recognition...');
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/face-recognition/find-closest-match`, {
        embedding: JSON.stringify(embedding)
      });
      
      const result = response.data;
      console.log(result);
      
      setTimeout(() => {
        setMatchResult(result.match);

        setStatus(result.success ? 'success' : 'error');
        setMessage(result.success 
            ? `Welcome back, ${result.user.firstName} ${result.user.lastName}!` 
            : 'Face not recognized. Please try again or register.');
          
      }, 0);
      
    } catch (error) {
      console.error('Error during face recognition:', error);
      setStatus('error');
      setMessage(`Recognition failed: ${error.message}`);
    }
  };

  // Reset the process
  const handleReset = () => {
    setStatus('waiting');
    setMessage('Initializing face detection...');
    setMatchResult(null);
    setCapturedFace(null);
    setIsCapturing(true);
  };

  // Get background color based on status
  const getStatusBackgroundColor = () => {
    switch (status) {
      case 'waiting':
      case 'detecting':
        return colors.powderBlue;
      case 'processing':
        return '#B4C0D8';
      case 'success':
        return colors.zomp;
      case 'error':
        return colors.burgundy;
      default:
        return colors.powderBlue;
    }
  };

  // Function to render user detail field
  const renderUserDetail = (label, value) => {
    return value ? (
      <div className="mb-2">
        <p className="text-sm" style={{ color: colors.gray }}>{label}:</p>
        <p className="font-medium text-sm" style={{ color: colors.powderBlue }}>
          {value}
        </p>
      </div>
    ) : null;
  };

  return (
    <div className="h-screen" style={{ backgroundColor: colors.raisinBlack }}>
      <div className="max-w-6xl mx-auto p-2">
        <div className="text-center mb-2 pt-2">
          <h1 className="text-2xl font-bold" style={{ color: colors.powderBlue }}>
            Face Recognition
          </h1>
          <p className="text-sm" style={{ color: colors.gray }}>
            Look at the camera to automatically authenticate
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column - Camera/Face Display */}
          <div className="flex-1 rounded-lg shadow-xl p-3" style={{ backgroundColor: colors.oxfordBlue }}>
            {/* Status indicator */}
            <div className="mb-3 p-2 rounded-lg text-center" 
              style={{ 
                backgroundColor: getStatusBackgroundColor(),
                color: status === 'error' ? 'white' : colors.raisinBlack,
                transition: 'background-color 0.3s ease'
              }}>
              <p className="font-medium text-sm">{message}</p>
            </div>

            {/* Face detector component */}
            {(status === 'waiting' || status === 'detecting') && (
              <div className="p-2 rounded-lg" style={{ backgroundColor: colors.delftBlue }}>
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
                <p className="mb-3 text-sm" style={{ color: colors.powderBlue }}>
                  Face not recognized or error occurred.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: colors.powderBlue, color: colors.raisinBlack }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Right column - User Details */}
          <div className="flex-1 rounded-lg shadow-xl p-3 overflow-auto max-h-screen" style={{ backgroundColor: colors.oxfordBlue }}>
            {status === 'success' && matchResult ? (
              <div className="flex flex-col py-2">
                <div className="flex items-start mb-3">
                  {/* User profile image */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mr-4" 
                    style={{ backgroundColor: colors.delftBlue, border: `3px solid ${colors.zomp}` }}>
                    {matchResult.user.profileImage && (
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${matchResult.user.profileImage}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Detected face image */}
                  {capturedFace && (
                    <div className="w-24 h-24 overflow-hidden rounded-lg" style={{ border: `2px solid ${colors.powderBlue}` }}>
                      <img 
                        src={capturedFace} 
                        alt="Detected Face" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="w-full p-3 rounded-lg mb-3" style={{ backgroundColor: colors.delftBlue }}>
                  <h2 className="text-lg font-bold mb-2" style={{ color: colors.powderBlue }}>
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
                      <h3 className="text-md font-medium mb-1" style={{ color: colors.powderBlue }}>Address</h3>
                      {renderUserDetail("Current", matchResult.user.currentAddress)}
                      {renderUserDetail("Permanent", matchResult.user.permanentAddress)}
                    </div>

                    {/* Status and Match Confidence */}
                    <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2">
                      <div>
                        <h3 className="text-md font-medium mb-1" style={{ color: colors.powderBlue }}>Status</h3>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: matchResult.user.present ? colors.zomp : colors.burgundy }}
                          ></div>
                          <span className="text-sm" style={{ color: colors.powderBlue }}>
                            {matchResult.user.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Match Confidence */}
                      {matchResult.confidence && (
                        <div>
                          <h3 className="text-md font-medium mb-1" style={{ color: colors.powderBlue }}>Confidence</h3>
                          <p className="text-sm" style={{ color: colors.powderBlue }}>
                            {`${(matchResult.confidence * 100).toFixed(2)}%`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                {/* Show captured face during processing */}
                {capturedFace && status === 'processing' && (
                  <div className="mb-4">
                    <h3 className="text-sm text-center mb-2" style={{ color: colors.powderBlue }}>Detected Face</h3>
                    <div className="w-32 h-32 overflow-hidden rounded-lg mx-auto" 
                      style={{ border: `2px solid ${colors.powderBlue}` }}>
                        {console.log(capturedFace)}
                      <img 
                        src={capturedFace} 
                        alt="Detected Face" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="text-center p-3">
                  <p className="text-sm" style={{ color: colors.powderBlue }}>
                    {status === 'processing' 
                      ? 'Processing facial recognition...' 
                      : 'User information will appear here once authenticated'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-2">
          <p style={{ color: colors.gray, fontSize: '0.7rem' }}>
            Secure facial authentication system
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptureImage;