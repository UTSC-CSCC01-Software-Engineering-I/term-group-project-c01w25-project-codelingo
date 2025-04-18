import { useEffect, useState } from "react";
import axios from "axios";
import background from "../../assets/landing.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { config } from "../../config.js"; // Ensure correct import

function Landing() {
  const text = "CodeLingo";
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      if (user) {
        try {
          const response = await axios.get(`${config.api.user}/streak`, {
            params: { username: user.displayName },
          });
          setStreak(response.data.streakValue);
        } catch (error) {
          console.error("Error fetching the streak:", error);
          setStreak("N/A");
        }
      }
    };

    fetchStreak();
  }, [user]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100%",
        }}
        className="landing flex flex-col items-center"
      >
        {user && (
          <div className="fade-in mt-60 flex flex-col items-center">
            <h1 className="text-white text-6xl font-mono font-bold">
              {("Welcome " + user.displayName).split("").map((char, index) => (
                <span
                  key={index}
                  className="letter"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    whiteSpace: 'pre', // Prevent whitespace collapsing
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
            <h2 className="text-white text-4xl font-mono font-light mt-2">
              Streak🔥: {streak !== null ? streak : "Loading..."}
            </h2>

            <h1>to</h1>
            <h1 className="text-white text-6xl m-4 font-mono font-bold">
              {(text + "!").split("").map((char, index) => (
                <span
                  key={index}
                  className="letter"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>
        )}
        {!user && (
          <div className="flex flex-col justify-center items-center mt-45">
            <h1 className="text-white text-6xl m-4 font-mono font-bold">
              {text.split("").map((char, index) => (
                <span
                  key={index}
                  className="letter"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
            <p className="text-white font-thin italic fade-in">
              Competitive Collaborative Coding
            </p>
            <p className="text-white text-center font-thin my-10 w-3/4 fade-in">
              Join a community of over 1,000 competitive coders who challenge
              themselves with real-time coding trivia and collaborative
              problem-solving. Whether you’re looking to test your knowledge,
              improve your skills, or climb the leaderboards, CodeLingo provides an
              engaging and interactive way to level up your coding game. Compete,
              learn, and grow—one question at a time!
            </p>
          </div>
        )}
        {!user && (
          <div className="fade-in">
            <Link
              to="/login"
              className="bg-white font-light py-2 px-16 m-10 rounded-full mt-10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-sky-200 font-light py-2 px-15 m-10 rounded-full mt-10"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Landing;