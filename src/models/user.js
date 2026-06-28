const mongoose = require("mongoose"); // importing mongoose

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
    },
    password: {
      type: String,
      required: true,
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
