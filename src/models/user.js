const mongoose = require("mongoose"); // importing mongoose
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      maxLength: 50,
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

// Adding userSchema methods BEFORE creating the model
userSchema.methods.getJWT = async function () {
  // arrow functions won't work for "this" keyword
  const user = this; // "this" is refering to that user who logged in

  // Create a JWT Token for the logged in user
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$101", {
    expiresIn: "1d",
  });
  return token;
};

// Creating userSchema methods to compare password(passwordInputByUser)
// Validating password for user trying to log in

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema); // creating a model

// Instances of Models are documents. Documents have many of their own built-in instance methods.
// Creating userSchema methods to getJWT()

module.exports = User; // exporting a model
