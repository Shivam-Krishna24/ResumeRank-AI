const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Unknown Candidate"
    },

    email: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    resumeFileName: {
      type: String,
      default: ""
    },

    resumeFilePath: {
      type: String,
      default: ""
    },

    resumeText: {
      type: String,
      required: true
    },

    extractedSkills: {
      type: [String],
      default: []
    },

    matchedSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    matchScore: {
      type: Number,
      default: 0
    },

    aiSummary: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Interview Scheduled"],
      default: "Pending"
    },

    interviewDate: {
      type: Date
    },

    interviewMode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online"
    },

    interviewNotes: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);