const express = require("express");

const {
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
} = require("../controllers/candidateController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload/:jobId",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/job/:jobId",
  protect,
  getCandidatesByJob
);

router.get(
  "/recent",
  protect,
  getRecentCandidates
);

router.get(
  "/upcoming-interviews",
  protect,
  getUpcomingInterviews
);

router.get(
  "/top",
  protect,
  getTopCandidate
);

router.get(
  "/:id",
  protect,
  getCandidateById
);

router.put(
  "/:id/status",
  protect,
  updateCandidateStatus
);

router.put(
  "/:id/notes",
  protect,
  updateCandidateNotes
);

router.put(
  "/:id/interview",
  protect,
  scheduleInterview
);

router.delete(
  "/:id",
  protect,
  deleteCandidate
);

module.exports = router;