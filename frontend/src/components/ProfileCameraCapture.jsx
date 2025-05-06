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
  const [showVideoCanvas, setShowVideoCanvas] = useState(false);

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
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setError(`Failed to load face detection models: ${error.message}`);
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowVideoCanvas(true); // Show video and canvas when starting camera
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 480, height: 360 }
      });
      console.log("Camera access granted");
      
      if (!videoRef.current) {
        console.error("Video element reference is null");
        setError("Could not access video element. Please try again.");
        setLoading(false);
        setShowVideoCanvas(false);
        return;
      }
      
      console.log("videoRef.current: ", videoRef.current);
      videoRef.current.srcObject = stream;
      console.log("Stream attached to video element. Stream tracks:", stream.getTracks().length);
      
      // Function to handle when video is ready
      const handleVideoReady = () => {
        console.log("Video metadata loaded, attempting to play");
        videoRef.current.play()
        .then(() => {
          console.log("Video started playing successfully. Video element state:", {
            paused: videoRef.current.paused,
            readyState: videoRef.current.readyState,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight
          });
          setIsCameraActive(true);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error playing video:", err);
          setError(`Failed to play video: ${err.message}`);
          setLoading(false);
          setShowVideoCanvas(false);
        });
      };
      
      videoRef.current.onloadedmetadata = handleVideoReady;
      
      // Fallback if metadata already loaded
      if (videoRef.current.readyState >= 2) {
        console.log("Video ready state is already ≥2, calling handleVideoReady immediately");
        handleVideoReady();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError(`Could not access the camera: ${error.message}. Please make sure you've given permission.`);
      setLoading(false);
      setShowVideoCanvas(false);
    }
  };

  // Trigger face detection when camera becomes active and video is playing
  useEffect(() => {
    if (isCameraActive && isModelLoaded && videoRef.current) {
      const video = videoRef.current;
      
      // Only start face detection when video is actually playing
      if (video.readyState >= 2 && !video.paused && video.videoWidth > 0) {
        console.log("Video is playing with dimensions available, starting face detection");
        startFaceDetection();
      } else {
        // Wait for video to start playing with dimensions
        const checkVideoReady = setInterval(() => {
          if (video.readyState >= 2 && !video.paused && video.videoWidth > 0) {
            console.log(`Video ready: dimensions ${video.videoWidth}x${video.videoHeight}`);
            clearInterval(checkVideoReady);
            startFaceDetection();
          }
        }, 100);
      }
    }
  }, [isCameraActive, isModelLoaded]);

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setShowVideoCanvas(false); // Hide video and canvas when stopping camera
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
    
    // Setup canvas dimensions
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    console.log(`Setting canvas dimensions to: ${displaySize.width}x${displaySize.height}`);
    
    // Ensure we have valid dimensions before proceeding
    if (displaySize.width === 0 || displaySize.height === 0) {
      console.error("Video dimensions are zero, cannot setup canvas");
      return;
    }
    
    // Set canvas dimensions
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);
    
    // Run continuous face detection
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
        
        // Call the parent component's handler with both the image file and embedding
        if (onImageCapture) {
          onImageCapture(imageFile, embedding);
        }
        
        // Stop the camera and hide video/canvas
        stopCamera();
        setShowVideoCanvas(false);
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
  
      {/* Video and Canvas Container - Only shown when needed */}
      <div className={`relative w-[480px] h-[360px] bg-black ${showVideoCanvas ? 'block' : 'hidden'}`}>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>
  
      {/* Button to Start Camera if not active */}
      {!isCameraActive && !loading && !capturedImage && (
        <button
          type="button"
          onClick={startCamera}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start Camera
        </button>
      )}
  
      {/* Capture and Stop buttons - Only shown when camera is active */}
      {isCameraActive && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={captureImage}
            className="px-3 py-2 bg-green-600 text-white rounded-lg"
          >
            Capture
          </button>
          <button
            type="button"
            onClick={stopCamera}
            className="px-3 py-2 bg-red-600 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
  
      {/* Preview captured image */}
      {capturedImage && (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-[480px] h-[360px] bg-black flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                resetCapture();
                startCamera();
              }}
              className="px-3 py-2 bg-yellow-500 text-white rounded-lg"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => {
                // Keep the captured image and do nothing else
                // The parent component already has the image from onImageCapture
              }}
              className="px-3 py-2 bg-green-600 text-white rounded-lg"
            >
              Use Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCameraCapture;
