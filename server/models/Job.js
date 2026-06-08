const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        requiredSkills: {
            type: [{
                type: String,
                lowercase: true,
                trim: true
            }],
            default: []
        },
        experienceLevel:{
            type: String,
            enum: [
                "Fresher",
                "Junior",
                "Mid",
                "Senior"
            ],
            default: "Fresher"
        },
        location: {
            type: String,
            default: "Remote"
        },
        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Internship",
                "Contract"
            ],
            default: "Full-time"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Job",jobSchema);