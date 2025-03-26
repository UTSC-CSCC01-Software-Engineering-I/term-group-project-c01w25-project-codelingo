import background from "../../assets/landing.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Landing() {
  const text = "CodeLingo";
  const { user } = useAuth();
  return (
    <>
      <div
        style={{
          // borderRadius: "50px 50px 50px 50px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100%",
        }}
        className="landing flex flex-col justify-center items-center"
      >
        <h1
          className="text-white text-6xl m-4 font-mono font-bold
"
        >
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
