const express = require("express"); // importing the module express from node modules
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express(); // calling express
require("dotenv").config();
require("./utils/cronjob");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json()); // express.json is a middleware to convert the json data of request body to js object and send to the server to add it to the database
app.use(cookieParser()); // Initialize the cookie parser middleware

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ⬇️ catches everything that didn't match above
app.use((req, res) => {
  res.status(404).send("Route not found !");
});

connectDB()
  .then(() => {
    console.log("Database Connection established...");
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    }); // created a web server which is listening on port 7777
  })
  .catch((error) => {
    console.error("Database cannot be connected !!");
  });
