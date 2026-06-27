const express = require("express"); // importing the module express from node modules
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express(); // calling express

// Order of the below routes matter
// Specific routes go first

// app.use("/user", (req, res) => {
//   res.send("Overridden All http methods to /user");
// });

// this will only handle GET call to /user
// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.query);
//   console.log(req.params);

//   res.send({ firstName: "Jahnabi", lastName: "Sarma" });
// });

// app.get(/.*a$/, (req, res) => {
//   res.send({ firstName: "Jahnabi", lastName: "Sarma" });
// });

// app.post("/user", (req, res) => {
//   res.send("Data saved to database successfully");
// });

// app.delete("/user", (req, res) => {
//   res.send("Data deleted from database successfully");
// });

// // This will match all the HTTP method API calls to "/"
// app.use("/", (req, res) =>
//   res.send(
//     "Overridden All http methods to /user except above written methods get, post & delete",
//   ),
// ); // request handler. Server responding to incoming requests from browser

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User Data sent");
});

app.get("/admin/getAllData", (req, res, next) => {
  try {
    throw new Error("Database crashed !");
    // res.send("All Data Sent");
  } catch (err) {
    next(err); // ⬅️ this triggers the error handler or
    //   res.status(500).send("Something broke");
  }
});

app.use("/", (err, req, res, next) => {
  console.error(err.message); // log the actual error
  res.status(500).send("Something broke");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});

// Keep this ALWAYS at the bottom
app.use((req, res) => {
  res.status(404).send("Route not found!");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
}); // created a web server which is listening on port 7777
