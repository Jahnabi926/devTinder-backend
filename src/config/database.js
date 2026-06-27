const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sarmajahnabi8_db_user:avc41S4gy3SwAye8@jahnabiscluster.rluv5ex.mongodb.net/devTinder?appName=JahnabisCluster",
  );
};
// connectDB here is a function that returns a promise, hence we use aync await

module.exports = connectDB;
