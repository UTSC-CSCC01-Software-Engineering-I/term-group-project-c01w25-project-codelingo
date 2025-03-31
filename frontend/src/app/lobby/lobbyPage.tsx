import { useEffect, useState } from "react";
import background from "../../assets/landing.jpg"; // Import background image
import "../styles/general.css"; // Import existing general styles
import "./lobbyPage.css"; // Import your specific lobby styles
import { getDailyChallenge, getLeaderboard } from "./lobbyPageAPI";
import { useLocation, useNavigate } from "react-router-dom";

interface Leader {
  username: string;
  rank: number;
}

const Lobby = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [topUsers, setTopUsers] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getLeaderboard();
      console.log("bruh" + usersData);
      // Convert object to array and sort by score descending
      const sortedUsers = Object.entries(usersData)
        .map(([id, user]) => ({ id, ...user }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Take top 5

      setTopUsers(sortedUsers);
    };

    fetchUsers();
  }, []);


  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/user/top-users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();

        // Directly set the leaders data without sorting
        setLeaders(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
        setLoading(true);
        setError(null);
    
    try {
      console.log("Generating daily challenge...");
      const data = await getDailyChallenge();
      console.log(data);
      console.log(data[0]);
      switch (data[0].problemType) {
        case "coding":
          navigate("/coding", { state: { problem: data, problemIndex: 0, dailyChallenge: true } });
          break;
        case "mcq":
          navigate("/mcq", { state: { problem: data, problemIndex: 0, dailyChallenge: true } });
          break;
        case "fill":
          navigate("/fill-in-the-blank", { state: { problem: data, problemIndex: 0, dailyChallenge: true } });
          break;
        default:
          break;
      }
    } catch (err) {
      setError("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="lobby page-background"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <div className="flex flex-col items-center pt-20">
        <h1 className="pb-6">Ranked Leaderboard</h1>

        {loading && <p>Loading leaderboard...</p>}
        {error && <p className="error">{error}</p>}

        {topUsers.length > 0 && (
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


        <button
              onClick={handleMatch}
              className="fade-in text-white bg-gradient-to-r from-indigo-800
                        via-indigo-600 to-blue-500 hover:bg-gradient-to-br
                        focus:ring-3 focus:outline-none focus:ring-cyan-300
                        dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50
                        dark:shadow-lg dark:shadow-cyan-800/80 font-bold
                        rounded-xl text-2xl px-10 py-3 w-full max-w-md
                        text-center mb-6 transition-all duration-300">
              Enter the Daily Challenge!
            </button>
      </div>
    </div>
  );
};

export default Lobby;