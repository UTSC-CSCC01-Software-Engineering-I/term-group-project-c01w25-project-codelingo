function matchMakingController(io) {
  let lobbies = {}; // Store active lobbies

  io.on("connection", (socket) => {
    console.log("hello");
    console.log(`User connected: ${socket.id}`);

    socket.on("createLobby", (callback) => {
      const lobbyCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store the problem with the lobby
      lobbies[lobbyCode] = {
        players: [],
        scores: {},
      };

      console.log(`Lobby ${lobbyCode} created with problem:`);

      callback(lobbyCode); // Send lobby code back to the frontend
    });

    // Handle joining a lobby
    socket.on("joinLobby", (lobbyCode, username) => {
      if (!lobbies[lobbyCode]) {
        lobbies[lobbyCode] = [];
      }

      lobbies[lobbyCode].push({ socketId: socket.id, username });
      lobbies[lobbyCode].scores.socketId = null;
      socket.join(lobbyCode);
      console.log(`${username} joined lobby ${lobbyCode}`);

      io.to(lobbyCode).emit("playerJoined", lobbies[lobbyCode]);
    });

    // Handle leaving a lobby
    socket.on("leaveLobby", (lobbyCode) => {
      if (lobbies[lobbyCode]) {
        lobbies[lobbyCode] = lobbies[lobbyCode].filter(
          (player) => player.socketId !== socket.id
        );
        socket.leave(lobbyCode);
        console.log(`User ${socket.id} left lobby ${lobbyCode}`);

        if (lobbies[lobbyCode].length === 0) {
          delete lobbies[lobbyCode]; // Delete the lobby if empty
          console.log(`Lobby ${lobbyCode} deleted`);
        } else {
          io.to(lobbyCode).emit("playerJoined", lobbies[lobbyCode]);
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      for (let lobbyCode in lobbies) {
        lobbies[lobbyCode] = lobbies[lobbyCode].filter(
          (player) => player.socketId !== socket.id
        );

        if (lobbies[lobbyCode].length === 0) {
          delete lobbies[lobbyCode]; // Delete lobby if empty
          console.log(`Lobby ${lobbyCode} deleted`);
        } else {
          io.to(lobbyCode).emit("playerJoined", lobbies[lobbyCode]);
        }
      }
    });

    socket.on("updateScore", (lobbyCode, score) => {
      lobbies[lobbyCode].scores[socket.id] = score;
      io.to(lobbyCode).emit("scoreUpdated", lobbies[lobbyCode]);
    });
  });
}

export default matchMakingController;
