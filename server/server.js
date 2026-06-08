const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");//Cross-origin resource sharing
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const exportRoutes = require("./routes/exportRoutes");
const path = require("path");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.get("/",(req,res)=>{
    res.json({
        message: "ResumeRank-AI backend is running."
    })
})

app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/export",exportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
    console.log("Go to link: http://localhost:5000");
});