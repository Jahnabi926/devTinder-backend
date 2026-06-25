const express = require("express"); // importing the module express from node modules

const app = express(); // calling express

// Order of the below routes matter
// Specific routes go first

app.use("/user", (req, res) => {
  res.send("Overridden All http methods to /user");
});

// this will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "Jahnabi", lastName: "Sarma" });
});

app.post("/user", (req, res) => {
  res.send("Data saved to database successfully");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted from database successfully");
});

// This will match all the HTTP method API calls to "/"
app.use("/", (req, res) =>
  res.send(
    "Overridden All http methods to /user except above written methods get, post & delete",
  ),
); // request handler. Server responding to incoming requests from browser

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
}); // created a web server which is listening on port 7777
