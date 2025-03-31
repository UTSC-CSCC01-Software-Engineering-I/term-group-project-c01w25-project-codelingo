import { useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/landing.jpg";
import "../styles/general.css";
import CodingProblemPage from "./codingProblemPage";
import McqProblemPage from "./mcqProblemPage";
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
    <div className='w-3/4 bg-gray-900 rounded-2xl shadow-2xl p-10 mt-10'>
      <h2 className="text-white text-3xl font-thick mt-10 mb-5">
        {generatedProblem.title}
      </h2>
      <div className="detail">
        <div className="tags-display">
          <span className="selected-tag">Difficulty: {generatedProblem.problemDifficulty}</span>
          <span className="selected-tag">{getProblemTypeLabel(generatedProblem.problemType)}</span>
          {generatedProblem.tags.map((tag, index) => (
            <span key={index} className="selected-tag">
              {tag}
            </span>
          ))}
          
        </div>
      </div>

      <div>
        <div>
          <p className="mt-4">{generatedProblem.problemDescription}</p>
        </div>
        

        {generatedProblem.problemType === "coding" && (
          <CodingProblemPage problem={generatedProblem} />
        )}
        {generatedProblem.problemType === "mcq" && (
          <McqProblemPage problem={generatedProblem} />
        )}
      </div>
    </div>

      <div className="flex justify-between items-center justify-center gap-8 m-10">
        <button onClick={() => navigate("/problems")}
                className="bg-transparent border border-[#666] cursor-pointer
                rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4
                hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
              >
            Go Back
        </button>
        <button onClick={handleDiscussProblemClick}
                className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md
                cursor-pointer text-lg leading-tight transition duration-300
                hover:bg-[#512fcace] active:bg-[#381aa2ce]">
          Discuss Problem
        </button>
        
        <button onClick={handleSolveProblem}
                className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md
                cursor-pointer text-lg leading-tight transition duration-300
                hover:bg-[#512fcace] active:bg-[#381aa2ce]">
          Solve Problem
        </button>
        <button onClick={handleSolveFriends}
                className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md
                cursor-pointer text-lg leading-tight transition duration-300
                hover:bg-[#512fcace] active:bg-[#381aa2ce]">
          Solve with Friends
        </button>
      </div>
    </div>
  );
};

export default GeneratedProblemPage;