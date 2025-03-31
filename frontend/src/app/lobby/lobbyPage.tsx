import { useEffect, useState } from "react";
import background from "../../assets/landing.jpg"; // Import background image
import "../styles/general.css"; // Import existing general styles
import "./lobbyPage.css"; // Import your specific lobby styles
import { getDailyChallenge } from "./lobbyPageAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from '../../config.ts';

interface Leader {
  username: string;
  rank: number;
}

const Lobby = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch(
          `${config.api.user}/top-users`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();

        // Directly set the leaders data without sorting
        setLeaders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const handleMatch = () => {
    console.log("Match button clicked");
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

        {leaders.length > 0 && (
          <table className="leaderboard">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={index}>
                  <td>{leader.rank}</td>
                  <td>{leader.username}</td>
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
              Match
            </button>
      </div>
    </div>
  );
};

export default Lobby;
