import { useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/landing.jpg";
import "../styles/general.css";
import CodingProblemPage from "./codingProblemPage";
import McqProblemPage from "./mcqProblemPage";
import FillProblemPage from "./fillProblemPage";
import { useSocket } from "../../socketContext";

interface TestCase {
  input: string;
  output: string;
}

interface Option {
  option: string;
  isCorrect: boolean;
}

interface Problem {
  id: number;
  title: string;
  problemType: string;
  problemDifficulty: number;
  problemDescription: string;
  tags: string[];
  testCases?: TestCase[]; // Only for coding
  constraints?: string[]; // Only for coding
  options?: Option[]; // Only for MCQ
  correctAnswer?: string; // Only for Fill in the Blank
  verified: boolean;
  createdAt: Date;
}
const GeneratedProblemPage = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const generatedProblem: Problem | null = location.state?.generatedProblem;

  const typeOptions = [
    { label: "Coding", value: "coding" },
    { label: "MCQ", value: "mcq" },
    { label: "Fill In The Blank", value: "fill" },
  ];

  const getProblemTypeLabel = (value: string) => {
    return typeOptions.find((option) => option.value === value)?.label || value;
  };

  const handleSolveProblem = () => {
    if (!generatedProblem) return;

    switch (generatedProblem.problemType) {
      case "coding":
        navigate("/coding", { state: { problem: generatedProblem } });
        break;
      case "mcq":
        navigate("/mcq", { state: { problem: generatedProblem } });
        break;
      case "fill":
        navigate("/fill-in-the-blank", { state: { problem: generatedProblem } });
        break;
      default:
        break;
    }
  };

  const handleDiscussProblemClick = () => {
    if (generatedProblem) {
      navigate('/discussions/new-discussion', {
        state: {
          previousPage: '/problems/generated',
          problemId: generatedProblem.id,
          problemTitle: generatedProblem.title,
          problemDescription: generatedProblem.problemDescription,
          problemTags: generatedProblem.tags,
        },
      });
    }
  };

  const handleSolveFriends = () => {
    // Emit createLobby event with a callback to handle the response
    socket.emit("createLobby", generatedProblem, (response) => {
      if (response.success) {
        // Redirect to the lobby page with the generated lobby code
        navigate(`/player-lobby/${response.lobbyCode}`, {
          state: {
            lobbyCode: response.lobbyCode,
          },
        });
      } else {
        console.error("Failed to create lobby");
      }
    });
  };

  if (!generatedProblem) {
    return (
      <div
        className="text-white text-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "10vh",
        }}
      >
        <p>No problem found. Go back and generate a new one.</p>
        <button onClick={() => navigate("/problems")}>Go Back</button>
      </div>
    );
  }

  return (
    <div
      className="problems"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "10vh",
      }}
    >
      <h2 className="text-white text-3xl font-thick italic text-center mt-10 mb-5">
        Generated Question:
      </h2>

      <div className="problem-details">
        <div className="detail mt-5">
          <label className="text-white">Title:</label>
          <input
            type="text"
            style={{ width: "100%", minWidth: "1000px" }}
            value={generatedProblem.title}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Type:</label>
          <input
            type="text"
            value={getProblemTypeLabel(generatedProblem.problemType)}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Difficulty:</label>
          <input
            type="text"
            value={generatedProblem.problemDifficulty}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Description:</label>
          <textarea
            value={generatedProblem.problemDescription}
            readOnly
            className="problem-result"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Tags:</label>
          <div className="tags-display mt-3">
            {generatedProblem.tags.map((tag, index) => (
              <span key={index} className="selected-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {generatedProblem.problemType === "coding" && (
          <CodingProblemPage problem={generatedProblem} />
        )}
        {generatedProblem.problemType === "mcq" && (
          <McqProblemPage problem={generatedProblem} />
        )}
        {generatedProblem.problemType === "fill" && (
          <FillProblemPage problem={generatedProblem} />
        )}
      </div>

      <div className="flex justify-center gap-5 m-10">
        <button onClick={handleDiscussProblemClick} className="flex-1 p-3 m-10">
          Discuss Problem
        </button>
        <button
          onClick={() => navigate("/problems")}
          className="flex-1 p-3 m-10"
        >
          Go Back
        </button>
        <button onClick={handleSolveProblem} className="flex-1 p-3 m-10">
          Solve Problem
        </button>
        <button onClick={handleSolveFriends} className="flex-1 p-3 m-10">
          Solve with Friends
        </button>
      </div>
    </div>
  );
};

export default GeneratedProblemPage;
