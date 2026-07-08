const mongoose = require("mongoose");

// creating a document instance from the model
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // referencing the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is ncorrect status type`,
      },
    },
  },
  { timestamps: true },
);

// below code happens before saving to database. // Changes will not be persisted to MongoDB because a pre hook errored out
connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  // check if fromUserId is same as toUserId. That is, the person sending request to itself
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself !"); // Without return, code would continue and call next() again at the bottom — causing issues! 🎯
  }
});
// creating a model
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
