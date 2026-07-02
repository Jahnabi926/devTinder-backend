const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { ValidateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate Data in signup API
    ValidateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new user instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // Creates a new user object in memory (like a JS object)

    await user.save(); // saves the data to the database
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Once email and password is validated, Create a JWT Token
      const token = await user.getJWT();

      // Send the token to the browser inside a secure cookie
      res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 }); // expires in 24 hours

      res.send("Login Successful !!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = authRouter;
