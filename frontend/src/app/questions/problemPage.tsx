import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { generateProblem } from './problemApi';
import background from "../../assets/landing.jpg";
import './problem.css'
import TagSelector from "./tagSelector";

interface TestCase {
  input: string;
  output: string;
}

interface ProblemForm {
  problemType: string;
  problemDifficulty: number;
  tags: string[];
  userOptions: string;
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
  options?: string[]; // Only for MCQ
  correctAnswer?: string; // Only for Fill in the Blank
  verified: boolean;
  createdAt: Date;
}

const ProblemPage = () => {
  const navigate = useNavigate();

  const typeOptions = [
    { label: "Coding", value: "coding" },
    { label: "MCQ", value: "mcq" },
    { label: "Fill In The Blank", value: "fill" },
  ];

  const [formData, setFormData] = useState<ProblemForm>({
    problemType: "coding",
    problemDifficulty: 1,
    tags: [],
    userOptions: "",
  });

  const [generatedProblem, setGeneratedProblem] = useState<Problem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Allowable problem types and difficulties
  //const allowableTypes = ["coding", "mcq", "fill"];
  const difficulties = Array.from({ length: 10 }, (_, i) => i + 1);

  // Form input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "userOptions" ? value : value,
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prevData) => {
      const isSelected = prevData.tags.includes(tag);
      return {
        ...prevData,
        tags: isSelected
          ? prevData.tags.filter((t) => t !== tag)
          : [...prevData.tags, tag],
      };
    });
  };

  // Variation options change handler
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await generateProblem(formData);
      navigate('/problems/generated', { state: { generatedProblem: data } }); // Navigate to new page with data
    } catch (err) {
      setError("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  // "Get Question" button click handler
  const handleGetQuestionClick = () => {
    setShowForm(true);
  };

  // "Go Back" button click handler
  const handleBackToListClick = () => {
    setGeneratedProblem(null);
    setFormData({
      problemType: "coding",
      problemDifficulty: 1,
      tags: [],
      userOptions: "",
    });
    setShowForm(false); // Hide form on going back
  };

  const [showForm, setShowForm] = useState<boolean>(false);

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
        height: "100vh",
        display: "flex", // Enable flexbox
        flexDirection: "column", // Stack items vertically
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
      }}
    >
      {!showForm && !generatedProblem && (
        <div className="flex flex-col justify-center items-center h-full w-full">
        
          <>
            <h1 className="text-white text-6xl m-5 font-mono font-bold">
              Create New Question
            </h1>
            <p className="fade-in text-white font-thin italic m-5">
              Challenge yourself with an original problem and be the first to
              solve it!
            </p>
            <button
              onClick={handleGetQuestionClick}
              className="fade-in text-white bg-gradient-to-r from-indigo-800
                        via-indigo-600 to-blue-500 hover:bg-gradient-to-br
                        focus:ring-3 focus:outline-none focus:ring-cyan-300
                        dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50
                        dark:shadow-lg dark:shadow-cyan-800/80 font-bold
                        rounded-xl text-2xl px-10 py-3 w-full max-w-md
                        text-center mb-6 transition-all duration-300"
            >
              Generate Question
            </button>
          </>
          </div>
        )}
        
        {loading && <p>Generating...</p>}
        {/* Show error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {showForm && !generatedProblem && (
          <div className='w-1/2 bg-gray-900 flex justify-center rounded-2xl shadow-2xl'>
            <form onSubmit={handleSubmit} style={{width: "600px"}}>
              <div className='pt-10 flex flex-row justify-between gap-28 items-center'>
                <label className="text-white text-lg min-w-max">Problem Type:</label>
                <select
                  id="problemType"
                  name="problemType"
                  //className='form-select'
                  className="block py-2.5 px-0 w-3/4 bg-gray-900
                            text-lg text-gray-400 border-0 border-b-2 
                            border-gray-200 appearance-none dark:text-gray-400
                            dark:border-gray-700 focus:outline-none focus:ring-0
                            focus:border-gray-200 peer"
                  value={formData.problemType}
                  onChange={handleInputChange}
                >
                  <option selected disabled hidden>Choose a Problem Type</option>
                  {typeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='pt-10 flex flex-row justify-between gap-20 items-center'>
                <label className="text-white text-lg min-w-max">
                  Problem Difficulty:
                </label>
                <select
                  id="problemDifficulty"
                  name="problemDifficulty"
                  className="block py-2.5 px-0 w-full bg-gray-900
                            text-lg text-gray-400 border-0 border-b-2 
                            border-gray-200 appearance-none dark:text-gray-400
                            dark:border-gray-700 focus:outline-none focus:ring-0
                            focus:border-gray-200 peer flex-end"
                  value={formData.problemDifficulty}
                  onChange={handleInputChange}
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <TagSelector selectedTags={formData.tags} onTagToggle={toggleTag} />
              </div>
              
              <div className='pt-10 flex flex-col justify-between gap-5'>
                <label className="text-white text-lg min-w-max">User Options:</label>
                <textarea
                  className="block p-2.5 w-full text-base text-gray-50 bg-gray-900
                            rounded-sm border border-gray-500 focus:outline-none focus:ring-0
                            dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white h-30"
                  placeholder="Write your options here..."
                  id="userOptions"
                  name="userOptions"
                  value={formData.userOptions}
                  onChange={handleOptionChange}
                />
              </div>
              <div>
              <div className="flex justify-between items-center my-10">
                <button
                  onClick={handleBackToListClick}
                  className="bg-transparent border border-[#666] cursor-pointer
                  rounded-md text-lg leading-tight transition duration-300 text-white px-9 py-4
                  hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                >
                  Go Back
                </button>
                
                <button
                  type="submit"
                  className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md
                  cursor-pointer text-lg leading-tight transition duration-300
                  hover:bg-[#512fcace] active:bg-[#381aa2ce]"
                  disabled={loading}
                >
                  Generate
                </button>
              </div>
            </div>

              
            </form>
          </div>
        )}
    </div>
  );
};

export default ProblemPage;
