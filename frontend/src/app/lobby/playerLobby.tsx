import background from "../../assets/landing.jpg";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import { config } from "../../config.ts";
//const { match } = config.api;
import { useSocket } from "../../socketContext";
import { useAuth } from "../context/AuthContext";

function PlayerLobby() {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [lobbyCode] = useState(location.state?.lobbyCode);
  //const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [nameMap, setNameMap] = useState({});

  useEffect(() => {
    if (socket) {
      socket.emit("joinLobby", lobbyCode, user.displayName);
    }
  }, []);

  useEffect(() => {
    socket.on("updateUsers", (players, nameMap) => {
      setNameMap(nameMap);
      setPlayers(players);
    });

    socket.on("codingProblem", (lobbyProblem) => {
      navigate("/coding", {
        state: { problem: lobbyProblem, lobbyCode: lobbyCode },
      });
    });

    return () => {
      socket.off("updateUsers");
      socket.off("codingProblem");
    };
  }, [socket]);

  /*
  const joinLobby = () => {
    if (lobbyCode && username) {
      socket.emit("joinLobby", lobbyCode, username);
    }
  }; */

  const handleLeaveLobby = () => {
    socket.emit("leaveLobby", lobbyCode, (response) => {
      console.log("left");
    });
    navigate("/join-lobby");
  };

  const handleStartGame = () => {
    socket.emit("startCodingProblem", lobbyCode);
  };

  return (
    <>
      <div
        style={{
          // borderRadius: "50px 50px 50px 50px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          width: "100%",
        }}
        className="flex flex-col justify-center items-center"
      >
        <div className="my-5 w-2/3 flex flex-col items-center h-185 bg-gray-900 text-white rounded-3xl">
          <h2 className="font-bold mt-10">Lobby Code:</h2>
          <h1 className="bg-white w-1/4 rounded-4xl p-2 flex items-center justify-center mb-2">
            <span className="text-black ">{lobbyCode}</span>
          </h1>

          <p className="text-md mb-10">Share the code to play with friends!</p>

          <h2 className="text-lg mb-2">Players in Lobby</h2>
          <div className="bg-gray-700 p-4 rounded-md w-4/5">
            {players.length > 0 ? (
              <ul className="space-y-2">
                <li className="text-2xl bg-gray-600 p-2 rounded h-12">
                  {players && players.length > 0 ? nameMap[players[0]] : ""}
                </li>
                <li className="text-2xl bg-gray-600 p-2 rounded h-12">
                  {players && players.length > 1 ? nameMap[players[1]] : ""}
                </li>
                <li className="text-2xl bg-gray-600 p-2 rounded h-12">
                  {players && players.length > 2 ? nameMap[players[2]] : ""}
                </li>
                <li className="text-2xl bg-gray-600 p-2 rounded h-12">
                  {players && players.length > 3 ? nameMap[players[3]] : ""}
                </li>
              </ul>
            ) : (
              <p className="text-gray-400">Waiting for players...</p>
            )}
          </div>
          <div className="flex justify-between mt-4 w-4/5">
            <button
              className="w-1/10 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleLeaveLobby}
            >
              Exit
            </button>
            <h2>{players.length}/4 Players</h2>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerLobby;
