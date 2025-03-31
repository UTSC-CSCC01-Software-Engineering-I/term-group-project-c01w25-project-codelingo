import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to specific origins, e.g. "http://localhost:8080"
    methods: ["GET", "POST"],
  },
});

// Enable CORS for all routes
app.use(cors());
app.use(express.static("public"));

// Listen for socket connections
let lobbies = {};
io.on("connection", (socket) => {
  console.log("connected: ", socket.id);

  // Send a welcome message to the client
  socket.emit("message", "Welcome to the socket server!");

  // Handle lobby creation
  socket.on("createLobby", (problem, callback) => {
    const lobbyCode = Math.random().toString(36).substr(2, 6); // Generate a unique code
    lobbies[lobbyCode] = {
      users: [],
      lobbyProblem: problem,
      scores: {},
      names: {},
    }; // Initialize the lobby with the creator's socket ID

    console.log(socket.id, `created lobby: ${lobbyCode}`);
    console.log(lobbies);

    // Emit the new lobby code to the client via the callback
    callback({ success: true, lobbyCode });
  });

  // Handle joining a lobby
  socket.on("joinLobby", (lobbyCode, name, callback) => {
    if (lobbies[lobbyCode]) {
      if (lobbies[lobbyCode].users.length >= 4) {
        return callback({ success: false, message: "Lobby is full" });
      }
      console.log("joining lobby...");

      // Add the user to the lobby's user list
      if (lobbies[lobbyCode].users.includes(socket.id)) {
        return;
      }
      lobbies[lobbyCode].users.push(socket.id);
      lobbies[lobbyCode].scores[socket.id] = null;
      lobbies[lobbyCode].names[socket.id] = name;

      console.log(`${name} joined lobby: ${lobbyCode}`);
      // Emit the updated user list to the lobby
      lobbies[lobbyCode].users.forEach((userId) => {
        io.to(userId).emit(
          "updateUsers",
          lobbies[lobbyCode].users,
          lobbies[lobbyCode].names
        ); // This emits the event to each user
      });
      console.log(lobbies[lobbyCode]);
    } else {
      callback({
        success: false,
        message: "No lobby with that code was found",
      }); // Error handling if the lobby does not exist
    }
  });

  // Handle leaving a lobby
  socket.on("leaveLobby", (lobbyCode, callback) => {
    if (lobbies[lobbyCode]) {
      // Remove the user from the lobby
      const userIndex = lobbies[lobbyCode].users.indexOf(socket.id);
      if (userIndex !== -1) {
        lobbies[lobbyCode].users.splice(userIndex, 1);
        delete lobbies[lobbyCode].scores[socket.id];
        delete lobbies[lobbyCode].names[socket.id];
        console.log(`User left the lobby: ${lobbyCode}`);

        // Emit the updated user list to the lobby
        lobbies[lobbyCode].users.forEach((userId) => {
          io.to(userId).emit(
            "updateUsers",
            lobbies[lobbyCode].users,
            lobbies[lobbyCode].names
          ); // This emits the event to each user
        });
        callback({ success: true });
      } else {
        callback({ success: false }); // Error handling if the user isn't in the lobby
      }
    } else {
      callback({ success: true }); // Error handling if the lobby does not exist
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Remove the user from all lobbies they were in
    for (let lobbyCode in lobbies) {
      const userIndex = lobbies[lobbyCode].users.indexOf(socket.id);
      if (userIndex !== -1) {
        lobbies[lobbyCode].users.splice(userIndex, 1);
        io.to(lobbyCode).emit("updateUsers", lobbies[lobbyCode].users); // Emit updated list
      }
    }
  });

  socket.on("lobbyExists", (lobbyCode, callback) => {
    if (lobbies[lobbyCode]) {
      callback({ exists: true });
    } else {
      callback({ exists: false });
    }
  });

  socket.on("startCodingProblem", (lobbyCode, callback) => {
    if (lobbies[lobbyCode]) {
      lobbies[lobbyCode].users.forEach((userId) => {
        io.to(userId).emit("codingProblem", lobbies[lobbyCode].lobbyProblem);
      });
    }
  });

  socket.on("updateScore", (lobbyCode, score) => {
    if (lobbies[lobbyCode]) {
      lobbies[lobbyCode].scores[socket.id] = score;
      console.log(lobbies[lobbyCode].scores);
      lobbies[lobbyCode].users.forEach((userId) => {
        io.to(userId).emit("updateScoreEvent", lobbies[lobbyCode].scores, lobbies[lobbyCode].names);
      });
    }
  });
});

// Set the server to listen on port 8087
server.listen(8087, () => {
  console.log("Server is running on http://localhost:8087");
});
