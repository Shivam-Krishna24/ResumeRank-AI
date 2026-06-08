const Candidate = require("../models/Candidate");
const { Parser } = require("json2csv");

const exportCandidatesCSV = async (req, res) => {

    try {

        const { jobId } = req.params;

        const candidates =
            await Candidate.find({
                jobId,
                uploadedBy: req.user._id
            });

        const csvData =
            candidates.map(candidate => ({
                Name: candidate.name,
                Email: candidate.email,
                Phone: candidate.phone,
                Score: candidate.matchScore,
                Status: candidate.status,
                MatchedSkills:
                    candidate.matchedSkills.join(", "),
                MissingSkills:
                    candidate.missingSkills.join(", ")
            }));

        const parser = new Parser();

        const csv = parser.parse(csvData);

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "candidates.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};

module.exports = {
    exportCandidatesCSV
};