
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["pdf", "video", "article", "link", "other"],
    default: "other",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Resource", ResourceSchema);
