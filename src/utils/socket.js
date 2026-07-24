const socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

// Reused for both joinChat and sendMessage — same logic your
// GET /user/connections route already uses to decide friendship.
const areUsersConnected = async (userId, targetUserId) => {
  const connection = await ConnectionRequestModel.findOne({
    $or: [
      { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
      { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
    ],
  });
  return !!connection;
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true, // required so the cookie is sent during the handshake
    },
  });

  // ---------- LAYER 1: AUTH (runs and fully completes BEFORE "connection" fires) ----------
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const { token } = cookies;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = decodedObj;

      const loggedInUser = await User.findById(_id);
      if (!loggedInUser) {
        return next(new Error("User not found"));
      }

      socket.user = loggedInUser; // trusted identity, guaranteed ready by the time "connection" fires
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ Authenticated socket for ${socket.user.firstName}`);

    // ---------- Event handlers — listeners registered immediately, no async gap ----------

    socket.on("joinChat", async ({ targetUserId }) => {
      try {
        const userId = socket.user._id.toString(); // trusted, not from payload

        // ---------- LAYER 2: FRIEND CHECK ----------
        const isConnected = await areUsersConnected(userId, targetUserId);
        if (!isConnected) {
          console.log(
            `Blocked joinChat: ${socket.user.firstName} is not connected to ${targetUserId}`,
          );
          return;
        }

        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(socket.user.firstName + " joined room " + roomId);
        socket.join(roomId);
      } catch (error) {
        console.log(error.message);
      }
    });

    socket.on("sendMessage", async ({ targetUserId, text }) => {
      try {
        const userId = socket.user._id.toString(); // trusted, not from payload

        // ---------- LAYER 2: FRIEND CHECK ----------
        const isConnected = await areUsersConnected(userId, targetUserId);
        if (!isConnected) {
          console.log(
            `Blocked sendMessage: ${socket.user.firstName} is not connected to ${targetUserId}`,
          );
          return;
        }

        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          text,
        });
        await chat.save();

        io.to(roomId).emit("messageReceived", {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          text,
        });
      } catch (error) {
        console.log(error.message);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
