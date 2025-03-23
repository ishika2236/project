import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from "face-api.js";

const ProfileCameraCapture = ({ onImageCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    const cleanup = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };

    return cleanup;
  }, []);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        console.log("Loading face detection models...");
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        
        console.log("Face detection models loaded successfully");
        setIsModelLoaded(true);
        setLoading(false);
        
        // Automatically start camera after models are loaded
        startCamera();
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setError(`Failed to load face detection models: ${error.message}`);
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Start face detection when camera becomes active
  useEffect(() => {
    if (isCameraActive && isModelLoaded) {
      console.log("Camera active and models loaded, starting face detection");
      startFaceDetection();
    }
  }, [isCameraActive, isModelLoaded]);

  // Start camera
  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 480, height: 360 } // Reduced size
      });
      console.log("Camera access granted");
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Function to handle when video is ready
        const handleVideoReady = () => {
          console.log("Video metadata loaded, attempting to play");
          videoRef.current.play()
            .then(() => {
              console.log("Video started playing successfully");
              setIsCameraActive(true);
              setLoading(false);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              setError(`Failed to play video: ${err.message}`);
              setLoading(false);
            });
        };
        
        // Set up event listener for when metadata is loaded
        videoRef.current.onloadedmetadata = handleVideoReady;
        
        // Fallback if metadata already loaded
        if (videoRef.current.readyState >= 2) {
          console.log("Video ready state is already ≥2, calling handleVideoReady immediately");
          handleVideoReady();
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError(`Could not access the camera: ${error.message}. Please make sure you've given permission.`);
      setLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Start face detection
  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Cannot start face detection: video or canvas ref is null");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    console.log("Starting face detection setup");
    
    // Setup canvas once video dimensions are available
    const setupCanvas = () => {
      // Wait for video dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log("Video dimensions not yet available");
        return false;
      }
      
      console.log(`Video dimensions available: ${video.videoWidth}x${video.videoHeight}`);
      
      // Set canvas dimensions
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);
      
      return true;
    };
    
    let canvasReady = setupCanvas();
    
    // If canvas not ready, check again
    if (!canvasReady) {
      console.log("Canvas not ready, setting up interval to check again");
      const checkInterval = setInterval(() => {
        canvasReady = setupCanvas();
        if (canvasReady) {
          console.log("Canvas now ready, running detection");
          clearInterval(checkInterval);
          runDetection();
        }
      }, 100);
    } else {
      console.log("Canvas ready immediately, running detection");
      runDetection();
    }
    
    // Run continuous face detection
    function runDetection() {
      console.log("Starting continuous face detection");
      const detectionInterval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || !isCameraActive) {
          console.log("Detection stopped: video or canvas ref is null or camera inactive");
          clearInterval(detectionInterval);
          return;
        }
        
        try {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks();
          
          const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height
          });
          
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw face detections
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          
          // Draw text indicating face detected
          if (detections.length > 0) {
            console.log("Face detected in frame");
            const { box } = detections[0].detection;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(box.x, box.y + box.height + 5, 120, 20);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('Face Detected', box.x + 5, box.y + box.height + 20);
          }
          
        } catch (error) {
          console.error("Error detecting faces:", error);
        }
      }, 100);
    }
  };

  // Capture image and face embedding
  const captureImage = async () => {
    if (!videoRef.current || !isModelLoaded) {
      setError("Video or face detection models not ready");
      return;
    }
    
    try {
      console.log("Attempting to capture image");
      const video = videoRef.current;
      
      // Detect face and get descriptor (embedding)
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      if (detections.length === 0) {
        setError("No face detected. Please ensure your face is clearly visible.");
        return;
      }
      
      console.log("Face detected for capture");
      
      // Create a canvas to capture the image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Convert to blob and then to file
      tempCanvas.toBlob((blob) => {
        if (!blob) {
          setError("Failed to create image blob");
          return;
        }
        
        // Create file from blob
        const imageFile = new File([blob], `profile_${Date.now()}.png`, { type: 'image/png' });
        
        // Store the face embedding
        const embedding = Array.from(detections[0].descriptor);
        setFaceEmbedding(embedding);
        
        // Create image preview URL
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        // console.log("Image captured successfully");
        // console.log("Face embedding:", embedding.slice(0, 5), "... (length:", embedding.length, ")");
        
        // Call the parent component's handler with both the image file and embedding
        if (onImageCapture) {
          onImageCapture(imageFile, embedding);
        }
        
        // Stop the camera
        stopCamera();
      }, 'image/png');
      
    } catch (error) {
      console.error("Error capturing image:", error);
      setError(`Error capturing image: ${error.message}`);
    }
  };

  // Reset capture
  const resetCapture = () => {
    setCapturedImage(null);
    setFaceEmbedding(null);
    setError(null);
    if (onImageCapture) {
      onImageCapture(null, null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {error && (
        <div className="w-full p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="p-2 bg-gray-100 rounded text-sm">
          <p>{isModelLoaded ? "Initializing camera..." : "Loading face detection models..."}</p>
        </div>
      )}
      
      {!isCameraActive && !loading && (
        <button
          type="button"
          onClick={startCamera}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center"
        >
          <span className="mr-2">📷</span> Use Camera
        </button>
      )}
      
      {isCameraActive && (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative w-full md:w-80 h-60 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>
          
          {isModelLoaded && (
            <div className="flex flex-col space-y-2 self-start mt-2">
              <button
                type="button"
                onClick={captureImage}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Capture Photo
              </button>
              
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCameraCapture;