const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Socket connected");

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
};
