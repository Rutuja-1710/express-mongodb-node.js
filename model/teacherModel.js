const mongoose = require("mongoose");
const teacherSchemaFields = require("../schema/teacherSchema");

const teacherSchema = new mongoose.Schema(teacherSchemaFields);
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
