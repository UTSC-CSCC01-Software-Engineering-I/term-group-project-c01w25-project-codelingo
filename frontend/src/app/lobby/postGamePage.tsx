import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import hooks from React Router
import background from "../../assets/landing.jpg"; // Import background image for styling
import '../styles/general.css'; // Import general styles
import './postGamePage.css'; // Import specific review page styles

interface GameData {
  username: string;
  score: number;
  lastMatchResult: string;
}

const PostGameReview = () => {
  const { username } = useParams<{ username: string }>(); // Extract username from URL
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const history = useHistory();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/user/gamescore?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();

        setGameData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [username]); // Re-run fetch when the username parameter changes

  const handleNewGame = () => {
    // Navigate to new game setup (assuming a route for setting up a new game)
    
  };


  return (
    <div
      className="review page-background"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
      }}
    >
      <div className="page-content">
        <h1>Post Game Review</h1>

        {loading && <p>Loading game data...</p>}
        {error && <p className="error">{error}</p>}

        {gameData && (
          <div className={`game-summary ${gameData.lastMatchResult.toLowerCase()}`}>
            <p><strong>Username:</strong> {gameData.username}</p>
            <p><strong>Score:</strong> {gameData.score}</p>
            <p>
              <strong>Last Match Result:</strong>
              {gameData.lastMatchResult === 'win' ? <span className="win">Win 🏆</span> : <span className="loss">Loss 😞</span>}
            </p>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleNewGame} className="action-button">New Game</button>
        </div>
      </div>
    </div>
  );
};

export default PostGameReview;