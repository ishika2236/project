import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from "face-api.js";

const AutoFaceDetector = ({ onEmbeddingGenerated, autoCapture = true, colors }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [processingCapture, setProcessingCapture] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false); // New state to track if capture is complete
  
  // Default colors if not provided
  const palette = colors || {
    delftBlue: '#2A3752',
    raisinBlack: '#171625',
    zomp: '#53AB94',
    oxfordBlue: '#1C2537',
    burgundy: '#8B242D',
    powderBlue: '#B4C0D8',
    gray: '#7D818A'
  };
  
  // Track consecutive frames with face
  const faceDetectionCountRef = useRef(0);
  const detectionIntervalRef = useRef(null);
  const MIN_FACE_FRAMES = 10; // Required consecutive frames with face
  const videoReadyRef = useRef(false);
  const lastDetectionRef = useRef(null); // Store the last good detection

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      stopCamera();
    };
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
    if (isCameraActive && isModelLoaded && videoReadyRef.current && !captureComplete) {
      console.log("Camera active and models loaded, starting face detection");
      startFaceDetection();
    }
  }, [isCameraActive, isModelLoaded, captureComplete]);

  // Start camera
  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 480, height: 360 }
      });
      console.log("Camera access granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Function to handle when video is ready
        const handleVideoReady = () => {
          console.log("Video metadata loaded, attempting to play");
          videoRef.current.play()
            .then(() => {
              console.log("Video started playing successfully");
              videoReadyRef.current = true;
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
      videoReadyRef.current = false;
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
        console.log("Video dimensions not available yet");
        return false;
      }
      
      // Set canvas dimensions
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);
      console.log("Canvas dimensions matched to video:", displaySize);
      
      return true;
    };
    
    let canvasReady = setupCanvas();
    
    // If canvas not ready, check again
    if (!canvasReady) {
      const checkInterval = setInterval(() => {
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          canvasReady = setupCanvas();
          if (canvasReady) {
            clearInterval(checkInterval);
            runDetection();
          }
        } else {
          console.log("Waiting for video to be ready...");
        }
      }, 100);
    } else {
      runDetection();
    }
    
    // Run continuous face detection
    function runDetection() {
      // console.log("Starting continuous face detection");
      
      // Custom drawing options
      const drawOptions = {
        // Custom detection box options
        boxColor: palette.zomp,
        boxLineWidth: 2,
        
        // Custom landmarks options
        landmarksColor: palette.powderBlue,
        pointSize: 2
      };
      
      detectionIntervalRef.current = setInterval(async () => {
        // Stop detection if we've already completed capture
        if (captureComplete) {
          clearInterval(detectionIntervalRef.current);
          return;
        }
        
        if (!videoRef.current || !canvasRef.current || !isCameraActive || processingCapture) {
          return;
        }
        
        // Make sure video is playing and ready
        if (videoRef.current.paused || videoRef.current.ended || videoRef.current.readyState < 2) {
          console.log("Video not ready for processing");
          return;
        }
        
        try {
          // Check if video is valid
          if (videoRef.current.videoWidth <= 0 || videoRef.current.videoHeight <= 0) {
            console.log("Invalid video dimensions");
            return;
          }
          
          // Ensure video is a valid input for face-api.js
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks();
          
          if (!canvasRef.current) return;
          
          const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height
          });
          
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Custom drawing
          if (resizedDetections.length > 0) {
            resizedDetections.forEach(detection => {
              // Draw face box with custom color
              const { box } = detection.detection;
              ctx.strokeStyle = drawOptions.boxColor;
              ctx.lineWidth = drawOptions.boxLineWidth;
              ctx.strokeRect(box.x, box.y, box.width, box.height);
              
              // Draw face landmarks with custom color
              const landmarks = detection.landmarks;
              const positions = landmarks.positions;
              
              ctx.fillStyle = drawOptions.landmarksColor;
              positions.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, drawOptions.pointSize, 0, 2 * Math.PI);
                ctx.fill();
              });
            });
            
            // Store the current detection for later use
            lastDetectionRef.current = resizedDetections[0];
          }
          
          // Check if face is detected
          if (detections.length > 0) {
            faceDetectionCountRef.current += 1;
            
            // Update UI to show face detected
            const { box } = detections[0].detection;
            // Background for text
            ctx.fillStyle = palette.raisinBlack + 'CC'; // Adding transparency
            ctx.fillRect(box.x, box.y + box.height + 5, 200, 24);
            // Progress bar background
            ctx.fillStyle = palette.delftBlue + '99';
            ctx.fillRect(box.x + 5, box.y + box.height + 35, 190, 8);
            // Progress bar fill
            const progressWidth = Math.min((faceDetectionCountRef.current / MIN_FACE_FRAMES) * 190, 190);
            ctx.fillStyle = palette.zomp;
            ctx.fillRect(box.x + 5, box.y + box.height + 35, progressWidth, 8);
            // Text
            ctx.fillStyle = palette.powderBlue;
            ctx.font = '16px Arial';
            ctx.fillText(`Face Detected (${faceDetectionCountRef.current}/${MIN_FACE_FRAMES})`, box.x + 10, box.y + box.height + 23);
            
            setFaceDetected(true);
            
            // Auto capture when face is stable (detected in consecutive frames)
            if (autoCapture && faceDetectionCountRef.current >= MIN_FACE_FRAMES && !processingCapture && !captureComplete) {
              // Stop the detection interval
              clearInterval(detectionIntervalRef.current);
              setCaptureComplete(true);
              
              // Capture and process the face
              captureAndProcessFace(detections);
            }
          } else {
            faceDetectionCountRef.current = 0;
            setFaceDetected(false);
          }
          
        } catch (error) {
          console.error("Error detecting faces:", error);
          
          faceDetectionCountRef.current = Math.max(0, faceDetectionCountRef.current - 1);
        }
      }, 100);
    }
  };

  // Capture and process face
  const captureAndProcessFace = async (detections) => {
    try {
      setProcessingCapture(true);
      
      // Make sure video is ready
      if (!videoRef.current || videoRef.current.readyState < 2 || !videoRef.current.videoWidth || !videoRef.current.videoHeight) {
        setError("Video not ready for capture. Please try again.");
        setProcessingCapture(false);
        return;
      }
      
      console.log("Capturing face from video frame");
      
      // Create a canvas to capture the image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoRef.current.videoWidth;
      tempCanvas.height = videoRef.current.videoHeight;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Get face descriptors (embeddings)
      console.log("Extracting face descriptors");
      const fullFaceDescriptions = await faceapi
        .detectAllFaces(tempCanvas, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      if (fullFaceDescriptions.length === 0) {
        setError("No face detected. Please ensure your face is clearly visible.");
        setProcessingCapture(false);
        setCaptureComplete(false); 
        return;
      }
      
      console.log("Face detected and processed for embedding");
      
      // Capture the face region from the last detection
      let faceImageUrl = null;
      if (lastDetectionRef.current) {
        const box = lastDetectionRef.current.detection.box;
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = box.width;
        faceCanvas.height = box.height;
        const faceCtx = faceCanvas.getContext('2d');
        
        // Draw the cropped face from the video stream
        faceCtx.drawImage(
          videoRef.current,
          box.x, box.y, box.width, box.height,
          0, 0, box.width, box.height
        );
        
        // Convert canvas to image URL
        faceImageUrl = faceCanvas.toDataURL('image/jpeg');
      }
      
      // Convert to blob
      tempCanvas.toBlob((blob) => {
        if (!blob) {
          setError("Failed to create image blob");
          setProcessingCapture(false);
          setCaptureComplete(false); // Reset if failed
          return;
        }
        
        // Create file from blob
        const imageFile = new File([blob], `face_auth_${Date.now()}.png`, { type: 'image/png' });
        
        // Extract the face embedding
        const embedding = Array.from(fullFaceDescriptions[0].descriptor);
        
        console.log("Face embedding generated successfully");
        
        // Call the parent component's handler with image file, embedding, and face image URL
        if (onEmbeddingGenerated) {
          onEmbeddingGenerated(imageFile, embedding, faceImageUrl);
        }
        
      }, 'image/png');
      
    } catch (error) {
      console.error("Error capturing face:", error);
      setError(`Error capturing face: ${error.message}`);
      setCaptureComplete(false); // Reset capture state on error
    } finally {
      setProcessingCapture(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div 
          className="w-full p-3 mb-4 rounded"
          style={{ 
            backgroundColor: palette.burgundy + '22',
            borderLeft: `4px solid ${palette.burgundy}`,
            color: palette.powderBlue
          }}
        >
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div 
          className="p-3 mb-4 rounded"
          style={{ 
            backgroundColor: palette.delftBlue, 
            color: palette.powderBlue
          }}
        >
          <div className="flex items-center">
            <div className="animate-pulse mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: palette.zomp }}></div>
            <p>{isModelLoaded ? "Initializing camera..." : "Loading face detection models..."}</p>
          </div>
        </div>
      )}
      
      <div 
        className="relative w-full h-72 rounded-lg overflow-hidden"
        style={{ 
          backgroundColor: palette.raisinBlack,
          border: `1px solid ${palette.delftBlue}`
        }}
      >
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
        
        {processingCapture && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: palette.raisinBlack + 'CC' }}
          >
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: `${palette.zomp} transparent transparent transparent` }}></div>
              <div style={{ color: palette.powderBlue }}>Processing...</div>
            </div>
          </div>
        )}
      </div>
      
      <div 
        className="mt-4 text-center text-sm"
        style={{ color: faceDetected ? palette.zomp : palette.gray }}
      >
        {!faceDetected 
          ? "Please position your face in the frame" 
          : processingCapture 
            ? "Capturing face data..." 
            : captureComplete
              ? "Face captured successfully!"
              : `Face detected! Hold still (${faceDetectionCountRef.current}/${MIN_FACE_FRAMES})`}
      </div>
    </div>
  );
};

export default AutoFaceDetector;