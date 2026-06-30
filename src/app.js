const express = require("express"); // importing the module express from node modules
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database");
const User = require("./models/user");
const { ValidateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express(); // calling express

app.use(express.json()); // express.json is a middleware to convert the json data of request body to js object and send to the server to add it to the database
app.use(cookieParser()); // Initialize the cookie parser middleware

// create users in the database
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERRORC: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  // Sending a connection request
  console.log("Sending a connection request");

  res.send(user.firstName + " sent the connection request");
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
