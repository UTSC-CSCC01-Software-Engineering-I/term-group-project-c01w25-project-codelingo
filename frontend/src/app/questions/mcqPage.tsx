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
  testCases?: TestCase[]; // Only for coding
  constraints?: string[]; // Only for coding
  options?: Option[]; // Only for MCQ
  correctAnswer?: string; // Only for Fill in the Blank
  verified: boolean;
  createdAt: Date;
}

const McqPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const problem: Problem | null = location.state?.problem || null;

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const correctOption = problem?.options?.find(
        (option) => option.option === selectedOption && option.isCorrect
      );
      if (correctOption) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      setIsAnswered(true);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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
        <h2 className="text-white text-3xl font-thick mt-10 mb-5">
          {problem.title}
        </h2>
        <div>
          <p className="mt-4">{problem.problemDescription}</p>
        </div>
        
        

        <div className="options-display mt-3">
          {problem.options && problem.options.length > 0 ? (
            <div className="flex flex-wrap -mx-2">
              {problem.options.map((option, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 px-2 mt-4"
                  onClick={() => handleOptionSelect(option.option)}
                >
                  <div
                    className={`cursor-pointer flex flex-col h-full p-3 rounded min-h-[130px] transition-colors ${
                      selectedOption === option.option
                        ? "bg-gray-700 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <p className="font-semibold mb-2 text-lg">
                      Option {String.fromCharCode(65 + index)}:
                    </p>
                    <div className="flex-1 text-center text-lg">{option.option}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">No options available.</p>
          )}
        </div>

        {isAnswered && (
          <div className="mt-6">
            {isCorrect ? (
              <p style={{ color: "green" }}>Correct Answer!</p>
            ) : (
              <p style={{ color: "red" }}>Incorrect Answer!</p>
            )}
          </div>
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

export default McqPage;