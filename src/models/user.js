const mongoose = require("mongoose"); // importing mongoose

const userSchema = new mongoose.Schema({
  // creating a schema
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema); // creating a model

module.exports = User; // exporting a model
