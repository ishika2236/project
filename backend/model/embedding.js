const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    embedding: {
        type: [Number], // Array of numbers representing the face embedding vector
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Update the updatedAt timestamp before saving

module.exports = mongoose.model('Embedding', embeddingSchema);
