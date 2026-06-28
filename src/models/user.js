const mongoose = require("mongoose"); // importing mongoose
const validator = require("validator");

const validateEmail = (value) => {
  if (!validator.isEmail(value)) {
    throw new Error("Invalid email address " + value);
  }
};
const validatePassword = (value) => {
  if (!validator.isStrongPassword(value)) {
    throw new Error("Enter a strong password " + value);
  }
};

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new Error("Invalid photo Url ", +value);
  }
};

const userSchema = new mongoose.Schema(
  {
    // creating a schema
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate: validateEmail,
    },
    password: {
      type: String,
      required: true,
      validate: validatePassword,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female or others",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://hostalitecloud.com/crb/wp-content/uploads/2025/10/dummy-user-male.jpg",
      validate: validateUrl,
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema); // creating a model

module.exports = User; // exporting a model
