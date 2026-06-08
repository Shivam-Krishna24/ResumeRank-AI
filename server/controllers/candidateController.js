const fs = require("fs");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const extractTextFromPDF = require("../utils/pdfParser");
const extractSkills = require("../utils/skillExtractor");
const calculateMatchScore = require("../utils/scoreCalculator");
const generateCandidateSummary = require("../utils/gemini");
const {
        extractEmail,
        extractPhone,
        extractName
    } = require("../utils/resumeInfoExtractor");


const uploadResume = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume"
      });
    }

    const resumeText = await extractTextFromPDF(req.file.path);

    const email = extractEmail(resumeText);

    const phone = extractPhone(resumeText);

    const name = extractName(resumeText);

    const extractedSkills =
    extractSkills(resumeText);

    const {
      matchedSkills,
      missingSkills,
      score
    } = calculateMatchScore(
      job.requiredSkills,
      extractedSkills
    );

    const aiSummary =
      await generateCandidateSummary(
          job,
          resumeText,
          matchedSkills,
          missingSkills,
          score
      );

    const candidate = await Candidate.create({
      name,
      email,
      phone,

      resumeFileName:
        req.file.filename,

      resumeFilePath:
        req.file.path,

      resumeText,

      extractedSkills,

      matchedSkills,

      missingSkills,

      matchScore: score,

      aiSummary,

      jobId: job._id,

      uploadedBy: req.user._id
    });


    res.status(201).json({
      message: "Resume uploaded and text extracted successfully",
      candidate
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCandidatesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const candidates = await Candidate.find({
      jobId: job._id,
      uploadedBy: req.user._id
    }).sort({
      matchScore: -1
    });

    res.status(200).json({
      count: candidates.length,
      candidates
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    }).populate("jobId", "title company requiredSkills");

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      candidate
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Shortlisted",
      "Rejected",
      "Interview Scheduled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const candidate = await Candidate.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    candidate.status = status;

    const updatedCandidate = await candidate.save();

    res.status(200).json({
      message: "Candidate status updated successfully",
      candidate: updatedCandidate
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const scheduleInterview = async (req, res) => {
  try {

    const {
      interviewDate,
      interviewMode,
      interviewNotes
    } = req.body;

    const candidate =
      await Candidate.findOne({
        _id: req.params.id,
        uploadedBy: req.user._id
      });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    candidate.interviewDate =
      interviewDate;

    candidate.interviewMode =
      interviewMode;

    candidate.interviewNotes =
      interviewNotes;

    candidate.status =
      "Interview Scheduled";

    const updatedCandidate =
      await candidate.save();

    res.status(200).json({
      message:
        "Interview scheduled successfully",
      candidate:
        updatedCandidate
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};


const updateCandidateNotes =
  async (req, res) => {

    try {

      const { notes } = req.body;

      const candidate =
        await Candidate.findOne({
          _id: req.params.id,
          uploadedBy: req.user._id
        });

      if (!candidate) {

        return res.status(404).json({
          message:
            "Candidate not found"
        });

      }

      candidate.notes = notes;

      const updatedCandidate =
        await candidate.save();

      res.status(200).json({
        message:
          "Notes updated successfully",
        candidate:
          updatedCandidate
      });

    } catch (error) {

      res.status(500).json({
        message: "Server error",
        error: error.message
      });

    }

};
const getRecentCandidates = async (
  req,
  res
) => {

  try {

    const candidates =
      await Candidate.find({
        uploadedBy: req.user._id
      })
      .sort({
        createdAt: -1
      })
      .limit(5)
      .select(
        "name matchScore status createdAt"
      );

    res.status(200).json({
      candidates
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};

const getUpcomingInterviews =
  async (req, res) => {

    try {

      const interviews =
        await Candidate.find({
          uploadedBy:
            req.user._id,

          interviewDate:
          {
            $exists: true
          }
        })
        .sort({
          interviewDate: 1
        })
        .limit(5)
        .select(
          "name interviewDate interviewMode"
        );

      res.status(200).json({
        interviews
      });

    } catch (error) {

      res.status(500).json({
        message: "Server error",
        error: error.message
      });

    }

};

const getTopCandidate =
  async (req, res) => {

    try {

      const candidate =
        await Candidate.findOne({
          uploadedBy:
            req.user._id
        })
        .sort({
          matchScore: -1
        });

      res.status(200).json({
        candidate
      });

    } catch (error) {

      res.status(500).json({
        message: "Server error",
        error: error.message
      });

    }

};

const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    await candidate.deleteOne();

    res.status(200).json({
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  uploadResume,
  getCandidatesByJob,
  getCandidateById,
  updateCandidateStatus,
  scheduleInterview,
  updateCandidateNotes,
  getRecentCandidates,
  getUpcomingInterviews,
  getTopCandidate,
  deleteCandidate
};