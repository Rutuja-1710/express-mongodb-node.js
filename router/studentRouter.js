const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Student = require("../model/studentModel");

const SALT_ROUNDS = 10;


const studentValidationRules = [
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

  body("course")
    .trim()
    .notEmpty().withMessage("Course is required"),

  body("age")
    .notEmpty().withMessage("Age is required").bail()
    .isInt({ min: 1, max: 120 }).withMessage("Age must be a number between 1 and 120"),
];

router.post("/register", studentValidationRules, async (req, res) => {
  try {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { name, email, password, course, age } = req.body;


    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "A student with this email is already registered",
      });
    }


    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      course,
      age,
    });
    const savedStudent = await newStudent.save();

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: savedStudent._id,
        name: savedStudent.name,
        email: savedStudent.email,
        course: savedStudent.course,
        age: savedStudent.age,
      },
    });
  } catch (err) {
    console.error("Error registering student:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the student",
      error: err.message,
    });
  }
});

module.exports = router;
