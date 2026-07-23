const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // io.on("connection") — fires on the server when a new client connects
    // Handle Events

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined room " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save message to database
        try {
          // Todo: check if userId and targetUserId are friends

          const roomId = getSecretRoomId(userId, targetUserId);

          // Find chats that have both 'userId' and 'targetUserId' participants
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
          io.to(roomId).emit("messageReceived", { firstName, lastName, text }); // io.to(roomId).emit(...) — method names for broadcasting to a room
        } catch (error) {
          console.log(error.message);
        }
      },
    );

    socket.on("disconnect", () => {}); // socket.on("disconnect") — fires when a client disconnects. Fixed (built into Socket.io, you cannot rename these)
  });
};

module.exports = initializeSocket;
