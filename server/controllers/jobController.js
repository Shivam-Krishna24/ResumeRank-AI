const Job = require("../models/Job");

const createJob = async (req,res)=>{
    try{
        const {
            title,
            company,
            description,
            requiredSkills,
            experienceLevel,
            location,
            jobType
        } = req.body;

        if(!title || !company || !description || !requiredSkills){
            return res.status(400).json({
                message: "PROVIDE COMPLETE DETAILS FOR THE JOB"
            });
        }
        let skillsArray = [];
        if(Array.isArray(requiredSkills)){
            skillsArray = requiredSkills;
        }else if(typeof requiredSkills === "string"){
            skillsArray = requiredSkills
                .split(",")
                .map((skill)=>skill.trim())
                .filter((skill)=>skill.length>0);
        }
        const job = await Job.create({
            title,
            company,
            description,
            requiredSkills: skillsArray,
            experienceLevel,
            location,
            jobType,
            createdBy: req.user._id
        });
        res.status(201).json({
            message: "Job created successfully",
            job
        })
    }catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

const getJobs = async (req,res) => {
    try{
        const jobs = await Job.find({ createdBy: req.user._id }).sort({
            createdAt: -1
        });
        res.status(200).json({
            count: jobs.length,
            jobs
        });
    }catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

const getJobById = async (req,res)=>{
    try{
        const job = await Job.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });
        if(!job){
            return res.status(404).json({
                message: "Job not found"
            });
        }
        res.status(200).json({
            job
        });

    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
}

const updateJob = async (req,res) =>{
    try{
        const job = await Job.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if(!job){
            return res.status(404).json({
                message: "Job not found"
            });
        }
        const {
            title,
            company,
            description,
            requiredSkills,
            experienceLevel,
            location,
            jobType
        } = req.body;

        if(title!= undefined)job.title = title;
        if(company!= undefined)job.company = company;
        if(description!= undefined)job.description = description;
        if(requiredSkills!= undefined){
            if(Array.isArray(requiredSkills)){
                job.requiredSkills = requiredSkills;
            }else if(typeof(requiredSkills)==="string"){
                job.requiredSkills = requiredSkills.split(",").map((skill)=>skill.trim()).filter((skill)=>skill.length>0);
            }
        }
        if(experienceLevel!= undefined)job.experienceLevel = experienceLevel;
        if(location!= undefined)job.location = location;
        if(jobType!= undefined)job.jobType = jobType;

        const updatedJob = await job.save();

        res.status(200).json({
            message: "Job Updated successfully",
            job:updatedJob
        })

    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

const deleteJob = async (req,res) => {
    try{
        const job = await Job.findOne({
            _id: req.params.id,
            createdBy : req.user._id
        });
        if(!job){
            return res.status(404).json({
                message: "Job not found"
            });
        }
        await job.deleteOne();
        res.status(200).json({
            message: "Job deleted Successfully!"
        });

    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};
