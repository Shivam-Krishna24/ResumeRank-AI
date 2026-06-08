const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

const getAnalytics = async (req, res) => {
    try {

        const totalJobs = await Job.countDocuments({
            createdBy: req.user._id
        });

        const totalCandidates =
            await Candidate.countDocuments({
                uploadedBy: req.user._id
            });

        const shortlisted =
            await Candidate.countDocuments({
                uploadedBy: req.user._id,
                status: "Shortlisted"
            });

        const rejected =
            await Candidate.countDocuments({
                uploadedBy: req.user._id,
                status: "Rejected"
            });
        const pending =
            await Candidate.countDocuments({
                uploadedBy: req.user._id,
                status: "Pending"
            });
        const interviewScheduled =
            await Candidate.countDocuments({
                uploadedBy: req.user._id,
                status: "Interview Scheduled"
            });

        const candidates =
            await Candidate.find({
                uploadedBy: req.user._id
            });

        let averageScore = 0;

        if (candidates.length > 0) {

            const totalScore =
                candidates.reduce(
                    (sum, candidate) =>
                        sum + candidate.matchScore,
                    0
                );

            averageScore =
                totalScore / candidates.length;
        }
        const missingSkillCounts = {};

        candidates.forEach(candidate => {

            candidate.missingSkills.forEach(skill => {

                missingSkillCounts[skill] =
                    (missingSkillCounts[skill] || 0) + 1;

            });

        });

        const topMissingSkills =
            Object.entries(missingSkillCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([skill, count]) => ({
                    skill,
                    count
                }));
        res.status(200).json({
            totalJobs,
            totalCandidates,

            shortlisted,
            rejected,
            pending,
            interviewScheduled,

            averageScore,

            topMissingSkills
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    getAnalytics
};