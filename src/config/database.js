const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};
// connectDB here is a function that returns a promise, hence we use aync await

module.exports = connectDB;
