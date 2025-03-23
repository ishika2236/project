// const faceapi = require('@vladmandic/face-api');
// const canvas = require('canvas');
// const { Canvas, Image } = canvas;
// const fs = require('fs').promises;
// const path = require('path');

// // Monkey patch face-api to use the canvas module
// faceapi.env.monkeyPatch({ Canvas, Image });

// // Define the path to your test image
// const TEST_IMAGE_PATH = 'uploads/1742674405592-8a9a92_9e2108dd6a5f4c14882a3032532b0585~mv2.png';

// // Load face-api models
// const loadModels = async () => {
//     console.log('Loading models...');
//     // Update this path to where your models are stored
//     const modelsPath = 'models';
    
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);
    
//     console.log('Models loaded successfully');
// };

// // Test function to generate face embedding
// const testFaceEmbedding = async (imagePath) => {
//     try {
//         console.log(`Testing with image: ${imagePath}`);
        
//         // Check if image exists
//         await fs.access(imagePath);
//         console.log('Image file exists');
        
//         // Load the image
//         const img = await canvas.loadImage(imagePath);
//         console.log('Image loaded successfully');
        
//         console.log('Detecting face and generating embedding...');
//         // Detect face and get descriptor
//         const detection = await faceapi.detectSingleFace(img)
//             .withFaceLandmarks()
//             .withFaceDescriptor();
        
//         if (!detection) {
//             console.log('❌ No face detected in the image');
//             return null;
//         }
        
//         // Get the embedding
//         const embedding = detection.descriptor;
//         console.log('✅ Face embedding generated successfully!');
        
//         // Print the first few values of the embedding to verify it's working
//         console.log('Embedding preview (first 5 values):');
//         console.log(Array.from(embedding).slice(0, 5));
        
//         // Print the length of the embedding (should be 128 for face-api)
//         console.log(`Embedding length: ${embedding.length}`);
        
//         return embedding;
//     } catch (error) {
//         console.error('❌ Error generating face embedding:', error);
//         return null;
//     }
// };

// // Main function
// const main = async () => {
//     try {
//         await loadModels();
//         const embedding = await testFaceEmbedding(TEST_IMAGE_PATH);
        
//         if (embedding) {
//             // Save embedding to a test file for inspection
//             const testOutputPath = path.join(__dirname, 'test-embedding.json');
//             await fs.writeFile(
//                 testOutputPath,
//                 JSON.stringify({
//                     embedding: Array.from(embedding),
//                     timestamp: new Date().toISOString()
//                 }, null, 2)
//             );
//             console.log(`✅ Test embedding saved to: ${testOutputPath}`);
//         }
//     } catch (error) {
//         console.error('❌ Error in test:', error);
//     }
// };

// // Run the test
// main();