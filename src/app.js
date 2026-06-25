const express = require("express"); // importing the module express from node modules

const app = express(); // calling express

// Specific routes go first
app.use("/test", (req, res) => res.send("Hello test request handler"));

app.use("/hello", (req, res) => res.send("Hello from request handler hello"));

// Generic catch-all prefix goes last or use app.get for all
app.use("/", (req, res) => res.send("Hello from the Server")); // request handler. Server responding to incoming requests from browser

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
}); // created a web server which is listening on port 7777
