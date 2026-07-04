const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

// Sending a connection request

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;

      // validate status
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: "Invalid status type: " + status });
      }

      // checking if the same connection request already exists
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exist !" });
      }

      // checking if the userId we are sending connection request , exists in our database or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found !" });
      }

      // Step 1 — Create document in memory
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      // Step 2 — Save to database
      const data = await connectionRequest.save();
      res.send({
        message:
          req.user.firstName +
          (status === "interested"
            ? " is interested in " + toUser.firstName
            : " ignored " + toUser.firstName),
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  },
);

module.exports = requestRouter;
