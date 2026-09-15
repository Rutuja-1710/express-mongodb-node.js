const express = require("express");
const mongoose = require("mongoose");

const teacherRouter = require("./router/teacherRouter");
const studentRouter = require("./router/studentRouter");

const app = express();
const PORT = 3000;

const MONGO_URI = "mongodb://127.0.0.1:27017/teacherStudentDB";

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running. Use POST /teacher/register or /student/register.");
});


app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
