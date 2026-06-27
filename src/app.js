const express = require("express"); // importing the module express from node modules

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express(); // calling express

app.use(express.json()); // express.json is a middleware to convert the json data of request body to js object and send to the server to add it to the database

// create users in the database
app.post("/signup", async (req, res) => {
  // creating a new user instance of the User model
  const user = new User(req.body); // Creates a new user object in memory (like a JS object)

  try {
    await user.save(); // saves the data to the database
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

// get user by emailId -- read (from database)
app.get("/user", async (req, res) => {
  try {
    const userEmail = await User.find({ emailId: "sarma5@gmail.com" }); // goes to DB, finds matching docs, returns them as an array
    if (userEmail.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(userEmail);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({}); // find all documents
    if (feed.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(feed);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// ⬇️ catches everything that didn't match above
app.use((req, res) => {
  res.status(404).send("Route not found !");
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
