
import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, LoaderCircle, UserCheck, MapPin, Check, AlertTriangle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Attendance Component that handles face verification and location checking
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.classItem - Class information object with at least _id and title
 * @param {boolean} props.isDark - Whether to use dark mode styling
 * @param {Function} props.verifyFace - Function that receives face embedding data and returns a Promise that resolves to {success: boolean}
 * @param {Function} props.checkLocationAndMarkPresent - Function that receives {classId, location} and returns a Promise that resolves to {isValid: boolean}
 * @param {string} props.modelsPath - Path to face-api models, defaults to '/models'
 */
const AttendanceComponent = ({ 
  isOpen, 
  onClose, 
  classItem, 
  isDark,
  verifyFace,
  checkLocationAndMarkPresent,
  modelsPath = '/models'
}) => {
  // Component state
  const [step, setStep] = useState('initial');
  const [stream, setStream] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [username, setUsername] = useState(''); // To display personalized messages
  const [autoCloseTimeout, setAutoCloseTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // References
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Load face-api models on component mount
  useEffect(() => {
    if (!isOpen) return;
    
    // Get username from localStorage or global state if available
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setUsername(user.firstName || user.name || 'superstar');
    
    const loadModels = async () => {
      try {
        console.log('[FaceAPI] Loading models...');
        const MODEL_URL = modelsPath;
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        console.log('[FaceAPI] Models loaded successfully');
        setModelsLoaded(true);
      } catch (error) {
        console.error('[FaceAPI] Error loading models:', error);
        setErrorMsg('Failed to load face detection models');
        setStep('error');
        toast.error('Failed to load face-api models');
      }
    };

    loadModels();

    return () => {
      stopCamera();
      // Clear any auto-close timeouts if component unmounts
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
      }
    };
  }, [isOpen, modelsPath]);

  // Reset component state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetComponentState();
      // Clear any auto-close timeouts
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
      }
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      console.log('[Camera] Requesting user media...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 } 
        } 
      });
      
      if (!videoRef.current) {
        console.error('[Camera] Video reference is null');
        return;
      }
      
      videoRef.current.srcObject = mediaStream;
      
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
          console.log('[Camera] Stream started successfully');
          setStream(mediaStream);
          
          // Detect face after video is playing (short delay to ensure video is initialized)
          setTimeout(() => detectFace(), 500);
        } catch (err) {
          console.error('[Camera] Play error:', err);
          setErrorMsg('Failed to start video stream');
          setStep('error');
        }
      };
      
    } catch (error) {
      console.error('[Camera] Access error:', error);
      setErrorMsg('Unable to access camera. Please enable permissions and try again.');
      setStep('error');
      toast.error('Camera access denied');
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if video is ready
    if (video.readyState !== 4) {
      // Try again in a short moment
      setTimeout(() => detectFace(), 100);
      return;
    }

    try {
      setStep('processing');
      
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      console.log('[FaceAPI] Detecting face...');
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      // Clear previous drawings
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (detections.length === 0) {
        console.log('[FaceAPI] No face detected, trying again');
        setTimeout(() => detectFace(), 500);
        return;
      }
      
      // We have detections - draw them
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      // Get the face descriptor data
      const faceDescriptor = resizedDetections[0].descriptor;
      const descriptorArray = Array.from(faceDescriptor);
      
      console.log('[FaceAPI] Face detected and descriptor extracted');
      
      // Process this embedding immediately
      processFaceEmbedding(descriptorArray);
      
    } catch (error) {
      console.error('[FaceAPI] Error detecting face:', error);
      setErrorMsg('Error detecting face. Please try again.');
      setStep('error');
    }
  };

  const processFaceEmbedding = async (embeddingData) => {
    console.log('[FaceAPI] Processing face data');
    setIsLoading(true);
    
    try {
      const result = await verifyFace(embeddingData);
      
      if (result && result.success) {
        console.log('[FaceAPI] Face verification successful');
        toast.success('Yayyy! Face verified! ✨');
        setStep('face-verified');
        
        // Get location immediately after face verification
        getLocation();
      } else {
        console.error('[FaceAPI] Face verification failed');
        setErrorMsg('Face verification failed. Please try again.');
        setStep('error');
      }
    } catch (error) {
      console.error('[FaceAPI] Face verification error:', error);
      setErrorMsg('Face verification failed: ' + (error?.message || 'Unknown error'));
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLocation = () => {
    console.log('[Location] Requesting permission...');
    
    if (!navigator.geolocation) {
      console.error('[Location] Not supported by browser');
      setErrorMsg('Geolocation is not supported by your browser.');
      setStep('error');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        console.log('[Location] Position acquired:', userLocation);
        
        if (!classItem || !classItem._id) {
          console.error('[Location] Missing classItem or classItem._id');
          setErrorMsg('Class information missing. Cannot verify location.');
          setStep('error');
          return;
        }
        
        setIsLoading(true);
        try {
          const result = await checkLocationAndMarkPresent({
            classId: classItem._id,
            location: userLocation,
          });
          
          if (result && result.isValid) {
            console.log('[Attendance] Successfully marked');
            setStep('success');
            
       
            
            setAutoCloseTimeout(timeoutId);
          } else {
            console.error('[Location] Verification failed');
            setErrorMsg('Location verification failed. You must be within the class area.');
            setStep('error');
          }
        } catch (error) {
          console.error('[Location] Verification error:', error);
          setErrorMsg('Location verification failed: ' + (error?.message || 'Unknown error'));
          setStep('error');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('[Location] Error:', error);
        setErrorMsg('Unable to get your location. Please enable location services.');
        setStep('error');
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  const resetComponentState = () => {
    stopCamera();
    setStep('initial');
    setErrorMsg('');
    setIsLoading(false);
    
    // Clear any auto-close timeouts
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
    }
  };

  const handleStart = () => {
    setStep('camera');
    startCamera();
  };
  
  const handleClose = () => {
    resetComponentState();
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const handleRetry = () => {
    resetComponentState();
    setStep('initial');
  };

  // Get Gen Z captions based on step
  const getGenZCaption = () => {
    switch(step) {
      case 'initial':
        return "Ready to check in? Let's make it happen! 🙌";
      case 'camera':
        return "Serving face for the camera... make it fashion! 💁‍♀️";
      case 'processing':
        return "Vibe check in progress... hold up! ⏳";
      case 'face-verified':
        return `OMG ${username}! Face recognized! Now checking if you're in the right spot! 📍`;
      case 'success':
        return `SLAY ${username}! You're officially present! Attendance secured! 💯`;
      case 'error':
        return "Big yikes! Something's not working... 😬";
      default:
        return "Loading... no cap! ⚡";
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-gray-900/80' : 'bg-black/50'}`}>
      <div className={`relative w-full max-w-md rounded-lg shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6`}>
        {/* Header */}
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold">
            {step === 'success' ? 'Attendance Marked!' : 'Mark Attendance'}
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {classItem?.title || 'Class Session'}
          </p>
        </div>

        {/* GenZ Caption */}
        <div className={`text-center mb-4 px-3 py-2 rounded-lg ${
          isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
        }`}>
          <p className="font-medium">{getGenZCaption()}</p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {step === 'initial' && (
            <div className="text-center py-6">
              <Camera className={`mx-auto h-16 w-16 mb-3 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className="mb-6">We'll need your camera and location to mark you present!</p>
              <button 
                onClick={handleStart} 
                className={`px-4 py-2 rounded-md font-medium ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isLoading || !modelsLoaded}
              >
                {!modelsLoaded ? (
                  <span className="flex items-center">
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Let\'s Go!'
                )}
              </button>
            </div>
          )}

          {step === 'camera' && (
            <div className="text-center">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  autoPlay 
                  playsInline
                  muted
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70 transition-opacity">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <p>Show us that beautiful face!</p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm">
                Looking for your face... stay still!
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-10">
              <LoaderCircle className={`mx-auto h-12 w-12 mb-4 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <p>Checking if it's really you...</p>
            </div>
          )}

          {step === 'face-verified' && (
            <div className="text-center py-6">
              <UserCheck className={`mx-auto h-12 w-12 mb-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              <p className="mb-2 font-medium">Yassss! Face verified! ✅</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Now checking if you're in the right spot...
              </p>
              <div className="mt-4">
                <LoaderCircle className={`mx-auto h-6 w-6 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <Check className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className="text-xl font-medium mb-2">You're All Set!</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Attendance secured! Teacher can see you're here!
              </p>
              <div className="mt-6 space-y-2">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <UserCheck className={`h-5 w-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                    <span>Face? Recognized! ✓</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <MapPin className={`h-5 w-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                    <span>Location? Perfect! ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <AlertTriangle className={`h-8 w-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className="text-xl font-medium mb-2">Oof! Not Working!</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {errorMsg || 'Something\'s sus with the verification. Let\'s try again!'}
              </p>
              <button 
                onClick={handleRetry} 
                className={`px-4 py-2 rounded-md font-medium ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isLoading}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          {step !== 'success' && (
            <button 
              onClick={handleClose} 
              className={`px-3 py-2 rounded-md text-sm ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              disabled={isLoading && (step === 'processing' || step === 'face-verified')}
            >
              Cancel
            </button>
          )}
        </div>
        
        {/* Toast Container */}
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme={isDark ? "dark" : "light"}
        />
      </div>
    </div>
  );
};

export default AttendanceComponent;