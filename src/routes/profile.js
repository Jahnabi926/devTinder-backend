const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ValidateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName}, your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // 1️⃣ who is making the request

    //   User sends → old password + new password
    const { oldPassword, newPassword } = req.body; // 2️⃣ what they are sending

    // Verify old password is correct
    const isPasswordValid = await loggedInUser.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid existing password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter a strong password !");
    }
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash; // ✅ update password
    // Save password to database
    await loggedInUser.save();

    // Send success response
    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = profileRouter;
