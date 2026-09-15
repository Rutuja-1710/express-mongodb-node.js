const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Teacher = require("../model/teacherModel");

const SALT_ROUNDS = 10;

const teacherValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required").bail()
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required").bail()
    .isEmail().withMessage("Email must be a valid email address"),

  body("password")
    .notEmpty().withMessage("Password is required").bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required"),
];

router.post("/register", teacherValidationRules, async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { name, email, password, subject } = req.body;

  
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "A teacher with this email is already registered",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

   
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      subject,
    });
    const savedTeacher = await newTeacher.save();

  
    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: {
        id: savedTeacher._id,
        name: savedTeacher.name,
        email: savedTeacher.email,
        subject: savedTeacher.subject,
      },
    });
  } catch (err) {
    console.error("Error registering teacher:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the teacher",
      error: err.message,
    });
  }
});

module.exports = router;
