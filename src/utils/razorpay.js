const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // YOUR_KEY_ID from razorpay dashboard -> accounts & settings -> api keys
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;
