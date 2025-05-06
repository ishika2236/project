
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider'; 
import { Bell, Calendar, BookOpen, FileText, CheckCircle, ChevronDown, ChevronRight, Clock, UserCheck, Map, User, MapPin, Camera, AlertCircle } from 'lucide-react';
import { markStudentAttendance, verifyStudentLocation, getCurrentLocation } from '../../app/features/attendance/attendanceService';

// AttendanceFaceRecognition component
const AttendanceFaceRecognition = ({ 
  classItem, 
  onSuccessfulAttendance, 
  onError, 
  onCancel,
  isDark
}) => {
  const [status, setStatus] = useState('initial'); // initial, detecting, verifying, locationCheck, success, error
  const [userDetails, setUserDetails] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoRef, setVideoRef] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);

  // Start video stream when component mounts
  useEffect(() => {
    if (status === 'detecting' && videoRef) {
      startVideo();
    }
    
    return () => {
      stopVideo();
    };
  }, [status, videoRef]);

  // Start camera
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user"
        } 
      });
      
      if (videoRef) {
        videoRef.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Cannot access camera. Please check permissions.");
      setStatus('error');
    }
  };

  // Stop camera
  const stopVideo = () => {
    if (videoRef && videoRef.srcObject) {
      const tracks = videoRef.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.srcObject = null;
    }
  };

  // Capture image from video
  const captureImage = () => {
    if (videoRef && canvasRef) {
      const context = canvasRef.getContext('2d');
      context.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
      
      // Convert canvas to blob/base64 and process it
      canvasRef.toBlob((blob) => {
        processFaceImage(blob);
      });
    }
  };

  // Process the captured face image
  const processFaceImage = async (imageBlob) => {
    try {
      // In a real implementation, you would send this to your face recognition API
      // For demo purposes, we'll simulate a successful response
      setStatus('verifying');
      
      // Simulate API call delay
      setTimeout(() => {
        // Simulated response with user match
        const mockUserData = {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          profileImage: "/api/placeholder/96/96",
          role: "Student"
        };
        
        setUserDetails(mockUserData);
        setFaceDetected(true);
        
        // After face is verified, check location
        checkLocation();
      }, 1500);
      
    } catch (error) {
      console.error("Face recognition error:", error);
      setErrorMessage("Face recognition failed. Please try again.");
      setStatus('error');
    }
  };

  // Check user's geolocation
  const checkLocation = () => {
    setStatus('locationCheck');
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get user's coordinates
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // In a real app, you would compare with the classroom's coordinates
          // For demo, we'll simulate a successful location match
          
          // Simulate verification for demo
          setTimeout(() => {
            setLocationVerified(true);
            setStatus('success');
            
            // Notify parent component of successful attendance
            if (onSuccessfulAttendance) {
              onSuccessfulAttendance();
            }
          }, 1000);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMessage("Location services are required for attendance.");
          setStatus('error');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setErrorMessage("Your browser doesn't support geolocation.");
      setStatus('error');
    }
  };

  // Start the verification process
  const startVerification = () => {
    setStatus('detecting');
  };

  // Reset the component
  const handleReset = () => {
    stopVideo();
    setStatus('initial');
    setFaceDetected(false);
    setLocationVerified(false);
    setUserDetails(null);
    setErrorMessage('');
  };

  // Cancel and close
  const handleCancel = () => {
    stopVideo();
    if (onCancel) {
      onCancel();
    }
  };

  // Retry after error
  const handleRetry = () => {
    handleReset();
    setStatus('detecting');
  };

  // Render appropriate content based on status
  const renderContent = () => {
    switch (status) {
      case 'initial':
        return (
          <div className="text-center p-4">
            <User className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`mb-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Ready to verify your attendance for <strong>{classItem?.title}</strong>
            </p>
            <button 
              onClick={startVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Start Verification
            </button>
          </div>
        );
      
      case 'detecting':
        return (
          <div className="text-center">
            <div className="relative mx-auto w-64 h-48 bg-gray-800 rounded-lg overflow-hidden mb-4">
              <video 
                ref={ref => setVideoRef(ref)} 
                autoPlay 
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => {
                  // Automatically capture after a short delay
                  setTimeout(captureImage, 1500);
                }}
              />
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg"></div>
            </div>
            <canvas 
              ref={ref => setCanvasRef(ref)} 
              width={320} 
              height={240} 
              className="hidden"
            />
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Scanning your face...</p>
            <div className="flex justify-center">
              <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        );
      
      case 'verifying':
        return (
          <div className="text-center p-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                <Camera className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Verifying your identity...</p>
            <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
              <div className="bg-blue-600 h-2 animate-pulse rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        );
      
      case 'locationCheck':
        return (
          <div className="text-center p-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'} rounded-full flex items-center justify-center`}>
                <MapPin className={`h-8 w-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {faceDetected ? "Face verified! Checking your location..." : "Verifying classroom location..."}
            </p>
            <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
              <div className="bg-indigo-600 h-2 animate-pulse rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center p-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${isDark ? 'bg-green-900/30' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                <CheckCircle className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
            <p className={`text-lg font-medium mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>Attendance Marked!</p>
            {userDetails && (
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Welcome, {userDetails.firstName} {userDetails.lastName}
              </p>
            )}
            <div className={`flex items-center justify-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <CheckCircle className={`h-4 w-4 mr-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span>Face verified</span>
              <CheckCircle className={`h-4 w-4 mx-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span>Location confirmed</span>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center p-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${isDark ? 'bg-red-900/30' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                <AlertCircle className={`h-8 w-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
            <p className={`text-lg font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Verification Failed</p>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{errorMessage || "An error occurred during verification."}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
      
      {/* Action buttons - only show on initial or error states */}
      {(status === 'initial' || status === 'error') && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCancel}
            className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} px-4 py-2 rounded-lg text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
export default AttendanceFaceRecognition;