const express = require("express");

const {
    exportCandidatesCSV
} = require("../controllers/exportController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/job/:jobId",
    protect,
    exportCandidatesCSV
);

module.exports = router;