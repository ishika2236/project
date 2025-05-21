const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  link: String, // Optional: useful if it's a YouTube or external link
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
  files: [
    {
      url: String,
      filename: String,
      mimetype: String,
    }
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Resource", ResourceSchema);
