

const Embedding = require('../model/embedding');
const User = require('../model/user');


const calculateCosineSimilarity = (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embedding vectors must have the same length');
  }

  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

const embeddingController = {
  
  findClosestMatch: async (req, res) => {
    try {
      let { embedding } = req.body;
      embedding = JSON.parse(embedding);
    //   console.log(embedding)
      // Validate request
      if (!embedding || !Array.isArray(embedding)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid embedding. Must provide an array of numbers.' 
        });
      }

      // Get all active embeddings
      const allEmbeddings = await Embedding.find({ isActive: true })
        .populate('user', 'firstName lastName email role profileImage group rollNumber mobile permanentAddress currentAddress');

      if (allEmbeddings.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No embeddings found in the database.' 
        });
      }

      // Calculate similarity for each stored embedding
      const similarities = allEmbeddings.map(storedEmbedding => {
        const similarity = calculateCosineSimilarity(embedding, storedEmbedding.embedding);
        return {
          embeddingId: storedEmbedding._id,
          userId: storedEmbedding.user._id,
          user: storedEmbedding.user,
          similarity
        };
      });

      // Sort by similarity (highest first)
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Get the top match
      const bestMatch = similarities[0];
      
      // Configure threshold as needed for your application
      const SIMILARITY_THRESHOLD = 0.2;
      
      if (bestMatch.similarity < SIMILARITY_THRESHOLD) {
        console.log(bestMatch.similarity)
        return res.status(404).json({
          success: false,
          message: 'No matching user found with sufficient confidence.',
          similarity: bestMatch.similarity
        });
      }

      // Return the best match
      return res.status(200).json({
        success: true,
        match: {
          user: bestMatch.user,
          similarity: bestMatch.similarity,
          embeddingId: bestMatch.embeddingId
        }
      });
    } catch (error) {
      console.error('Error finding closest embedding match:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getUserEmbeddings: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const embeddings = await Embedding.find({ 
        user: userId,
        isActive: true 
      });
      
      return res.status(200).json({
        success: true,
        count: embeddings.length,
        data: embeddings
      });
    } catch (error) {
      console.error('Error fetching user embeddings:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = embeddingController;