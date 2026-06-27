const express = require("express"); // importing the module express from node modules

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express(); // calling express

app.post("/signup", async (req, res) => {
  // creating a new user instance of the User model
  const user = new User({
    firstName: "Manash",
    lastName: "Sarma",
    emailId: "manash11@gmail.com",
    password: "manash@111",
  });

  try {
    await user.save(); // saves the data to the database
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    }); // created a web server which is listening on port 7777
  })
  .catch((error) => {
    console.error("Database cannot be connected !!");
  });
