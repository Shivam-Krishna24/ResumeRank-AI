const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};

const registerUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email ||!password){
            return res.status(400).json({
                message: "Provide complete details!"
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists!,Please Login"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,email,password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id)  
        });
    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
}

const loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message : "Please provide complete details!"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "User not registered, Please Register"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Invalid Password"
            });
        }
        res.status(200).json({
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id)
        });
    }catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

const getMe = async (req,res) => {
    try{
        res.status(200).json({
            user: req.user
        })
    }catch(err){
        res.status(500).json({
            message : "Server error",
            error: err.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getMe
};