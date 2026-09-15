const teacherSchemaFields = {
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Email must be a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
 
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

module.exports = teacherSchemaFields;
