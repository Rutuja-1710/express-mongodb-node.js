const mongoose = require("mongoose");
const studentSchemaFields = require("../schema/studentSchema");

const studentSchema = new mongoose.Schema(studentSchemaFields);


const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
