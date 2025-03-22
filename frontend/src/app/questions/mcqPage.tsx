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
      <div className="problem-details">
        <div className="detail mt-5">
          <label className="text-white">Title:</label>
          <input
            type="text"
            style={{ width: "100%", minWidth: "1000px" }}
            value={problem.title}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Difficulty:</label>
          <input
            type="text"
            value={problem.problemDifficulty}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Description:</label>
          <textarea
            value={problem.problemDescription}
            readOnly
            className="problem-result"
          />
        </div>
      </div>

      <div
        style={{
            marginTop:"25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1000px",
        }}
      >
        {Array.isArray(problem.options) && problem.options.length > 0 ? (
          problem.options.map((option, index) => (
            <div key={index} style={{ marginBottom: "10px", width: "100%" }}>
              <span style={{ marginRight: "10px", fontSize: "16px", color: "white" }}>
                {`Option ${String.fromCharCode(65 + index)}:`}
              </span>
              <button
                onClick={() => handleOptionSelect(option.option)}
                style={{
                  backgroundColor: selectedOption === option.option ? "lightblue" : "white",
                  color: "black",
                  padding: "15px",
                  margin: "5px",
                  cursor: "pointer",
                  border: "1px solid white",
                  fontSize: "16px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {option.option}
              </button>
            </div>
          ))
        ) : (
          <p>No options available</p>
        )}
      </div>

      {isAnswered && (
        <div>
          {isCorrect ? (
            <p style={{ color: "green" }}>Correct Answer!</p>
          ) : (
            <p style={{ color: "red" }}>Incorrect Answer!</p>
          )}
        </div>
      )}

      <button onClick={handleSubmit} style={{ padding: "10px", marginTop: "20px" }}>
        Submit Answer
      </button>
      <button onClick={handleBack} style={{ padding: "10px", marginTop: "20px" }}>
        Go Back
      </button>
    </div>
  );
};

export default McqPage;