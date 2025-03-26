import { useSocket } from "../../socketContext";
import background from "../../assets/landing.jpg";
import { useState } from "react";
import { useNavigate} from "react-router-dom";

function JoinLobby() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [warningMsg, setWarningMsg] = useState("");

  const handleJoinLobby = () => {
    const code = (document.querySelector("input") as HTMLInputElement).value;
    socket.emit("lobbyExists", code, (res: any) => {
      if (!res.exists) {
        setWarningMsg(res.message);
      } else {
        setWarningMsg("");
        navigate(`/player-lobby/${code}`, { state: { lobbyCode: code } });
      }
    });
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
        <h1 className="pb-6">Enter 6 Character Code</h1>
        <input
  type="text"
  placeholder="Enter Code"
  className="block text-2lg h-13 w-full max-w-md text-gray-900 border border-gray-300 
             rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6 transition-all duration-300 px-4"
/>

        <button
          onClick={handleJoinLobby}
          className="fade-in text-white bg-gradient-to-r from-indigo-800
                        via-indigo-600 to-blue-500 hover:bg-gradient-to-br
                        focus:ring-3 focus:outline-none focus:ring-cyan-300
                        dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50
                        dark:shadow-lg dark:shadow-cyan-800/80 font-bold
                        rounded-2xl text-2xl px-10 py-6 w-full max-w-md text-center mb-6 transition-all duration-300"
            >
          Join
        </button>
        <p>{warningMsg}</p>
      </div>
    </>
  );
}

export default JoinLobby;
