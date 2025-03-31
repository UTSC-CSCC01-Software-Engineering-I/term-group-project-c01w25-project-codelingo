import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/landing.jpg";
import "../styles/general.css";

interface Option {
  option: string;
  isCorrect: boolean;
}

interface TestCase {
  input: string;
  output: string;
}

interface Problem {
  id: number;
  title: string;
  problemType: string;
  problemDifficulty: number;
  problemDescription: string;
  tags: string[];
  testCases?: TestCase[];
  constraints?: string[];
  options?: Option[];
  correctAnswer?: string;
  verified: boolean;
  createdAt: Date;
}

const FillBlankPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const problem: Problem = location.state?.problem;
  
    const [userAnswer, setUserAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showLengthHint, setShowLengthHint] = useState(false);
    const [showFirstLetterHint, setShowFirstLetterHint] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
  
    const handleSubmit = () => {
      if (userAnswer.trim().toLowerCase() === problem.correctAnswer?.toLowerCase()) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!problem) {
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
            <div className='w-3/4 bg-gray-900 rounded-2xl shadow-2xl p-10 mt-10'>
            <h2 className="text-white text-3xl font-bold mt-10 mb-5">
                {problem.title}
            </h2>
            <p className="mt-4">{problem.problemDescription}</p>
            
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-2 rounded-md border border-gray-600 text-white bg-gray-800 mt-4"
            />
    
                <div className="hints mt-4 flex flex-col gap-4">
                    {!showLengthHint && (
                    <button 
                        onClick={() => setShowLengthHint(true)}
                        className="bg-transparent border border-[#666] cursor-pointer rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4 hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                    >
                        Show Hint: Length
                    </button>
                    )}
                    {showLengthHint && (
                    <p className="text-gray-300">Answer Length: {problem.correctAnswer?.length} characters</p>
                    )}
        
                    {!showFirstLetterHint && (
                    <button 
                        onClick={() => setShowFirstLetterHint(true)}
                        className="bg-transparent border border-[#666] cursor-pointer rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4 hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                    >
                        Show Hint: First Letter
                    </button>
                    )}
                    {showFirstLetterHint && (
                    <p className="text-gray-300">First Letter: {problem.correctAnswer?.charAt(0)}</p>
                    )}
                    {!showAnswer && (
                        <button 
                        onClick={() => setShowAnswer(true)}
                        className="bg-transparent border border-[#666] cursor-pointer rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4 hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                        >
                        Show Answer
                        </button>
                    )}
                </div>

                {showAnswer && (
                    <p className="mt-4">Answer: {problem.correctAnswer}</p>
                )}

                {isCorrect !== null && (
                    <p className="mt-4">
                        {isCorrect ? (
                        <p style={{ color: "green" }}>Correct Answer!</p>
                        ) : (
                        <p style={{ color: "red" }}>Incorrect Answer!</p>
                        )}
                    </p>
                )}
            </div>
  
            <div className="flex justify-between items-center my-10 gap-20">
                <button
                onClick={handleBack}
                className="bg-transparent border border-[#666] cursor-pointer
                rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4
                hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                >
                Go Back
                </button>
                
                <button
                onClick={handleSubmit}
                type="submit"
                className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md
                cursor-pointer text-lg leading-tight transition duration-300
                hover:bg-[#512fcace] active:bg-[#381aa2ce]"
                >
                Submit
                </button>
            </div>
        </div>
      );
    };
  
  export default FillBlankPage;