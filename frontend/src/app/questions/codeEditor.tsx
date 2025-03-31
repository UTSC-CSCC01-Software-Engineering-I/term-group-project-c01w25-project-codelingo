import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { runCode } from "./problemApi";
import { useLocation, useNavigate } from "react-router-dom";

interface TestCaseResult {
  correct: boolean;
  // Add more fields if necessary
}
interface Result {
  results: TestCaseResult[];
}

interface CodeEditorProps {
  onResultUpdate?: (score: number) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onResultUpdate }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [problem] = useState(location.state?.problem || {});
  const [lobbyCode] = useState(location.state?.lobbyCode || null);

  const [problemIndex] = useState(location.state?.problemIndex || 0);
  const [dailyChallenge] = useState(location.state?.dailyChallenge || false);
  const [result, setResult] = useState<Result>({ results: [] });

  let seconds = 0; // Local variable instead of state

  useEffect(() => {
    const interval = setInterval(() => {
      seconds++;
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const getParameterString = () => {
    console.log(problem[problemIndex]);
    return Object.keys(problem[problemIndex].testCases[0].input).join(", ");
  };
  const [code, setCode] = useState(`def run(${getParameterString()}):\n`);

  useEffect(() => {
    setLoading(Object.keys(problem[problemIndex]).length === 0);
    console.log(loading);
  }, [problem[problemIndex]]);

  const defaultCode = {
    python: `def run(${getParameterString()}):\n`,
    cpp: `#include <iostream>\nusing namespace std;\n\nvoid run() {\n    \n}`,
    java: `public class Main {\n    public static void run() {\n        \n    }\n}`,
  };

  useEffect(() => {
    if (!result || !result.results || result.results.length === 0) {
      setScore(0);
      return;
    }

    let amountCorrect = 0;
    for (let i = 0; i < result.results.length; i++) {
      const testcaseResult = result.results[i];
      if (testcaseResult.correct) {
        amountCorrect++;
      }
    }
    setScore(amountCorrect);
    onResultUpdate?.(amountCorrect / result.results.length);
    setOutput(`${amountCorrect}/${result.results.length}`);
  }, [result]);

  const getLanguageExtension = () => {
    switch (language) {
      case "python":
        return python();
      case "cpp":
        return cpp();
      case "java":
        return java();
      default:
        return python();
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage]); // Set new code when changing language
  };

  const handleRunCode = async () => {
    try {
      setOutput("");
      const result = await runCode(
        language,
        code,
        problem[problemIndex].testCases
      );
      console.log(result);

      await setResult(result);
    } catch (error) {
      console.log(error);
      await setOutput("Error running code.");
    }
  };

  const stringify = (value) => {
    return JSON.stringify(value, null, 2);
  };

  const handleFinish = () => {
    const adjustedTime = Math.max(1, seconds / 60);
    const finalScore = score * (10 / (1 + Math.log(adjustedTime))) * 10;

    if (lobbyCode) {
      navigate("/post-game", {
        state: {
          finalScore: finalScore,
          lobbyCode: lobbyCode,
        },
      });
    } else {
      navigate("/post-game", { state: { finalScore: finalScore } });
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-3/4 w-3/4 mt-10  ">
      {loading ? (
        <h2 className="text-lg font-bold mb-10">Loading...</h2>
      ) : (
        <div>
          <h2 className="text-lg font-bold">{problem[problemIndex]?.title}</h2>
          <div className="tag-container">
            {problem[problemIndex].tags.map((tag, index) => (
              <span
                key={index}
                className="tag bg-sky-200 text-xs text-black rounded-full px-3 py-1 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-8 mb-4">
            {problem[problemIndex]?.problemDescription}
          </p>
          <p>Sample test cases: </p>
          <div className="test-cases-container">
            {problem[problemIndex].testCases
              .slice(0, 2)
              .map((testCase, index) => (
                <div
                  key={index}
                  className="bg-gray-500 test-case mb-4 rounded font-mono text-sm p-2"
                >
                  <div className="test-case-input">
                    <strong>Input:</strong>{" "}
                    <span>{stringify(testCase.input)}</span>
                  </div>
                  <div className="test-case-output">
                    <strong>Output:</strong>{" "}
                    <span>{stringify(testCase.output)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <button
          className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
          onClick={handleRunCode}
        >
          Run Code
        </button>
        <select
          className="p-3 bg-gray-700 text-white rounded"
          value={language}
          onChange={handleLanguageChange} // Fixed event handler
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <CodeMirror
        value={code}
        height="300px"
        theme={dracula}
        extensions={[getLanguageExtension()]}
        onChange={(value) => setCode(value)}
      />
      <p className="mt-4">Constraints: </p>
      <div className="test-cases-container">
        {problem[problemIndex].constraints.map((constraint, index) => (
          <div
            key={index}
            className="bg-gray-500 test-case mb-4 rounded font-mono text-sm p-2"
          >
            <div className="test-case-input">
              <span>{constraint}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold">Tests passed:</h3>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
      {result?.results?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Test Case Results:</h3>
          <div className="test-cases-container">
            {result.results.map((testCase, index) => (
              <div
                key={index}
                className={`mb-4 rounded font-mono text-sm p-2 ${
                  testCase.correct ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <div className="mb-1">
                  <strong>Input:</strong> <span>Hidden</span>
                </div>
                <div className="mb-1">
                  <strong>Expected:</strong>{" "}
                  <span>{stringify(testCase.expected)}</span>
                </div>
                <div className="mb-1">
                  <strong>Actual:</strong>{" "}
                  <span>
                    {stringify(testCase.actual?.replace?.(/\r/g, ""))}
                  </span>
                </div>
                <div className="mt-1">
                  <strong>Result:</strong>{" "}
                  <span className="font-bold">
                    {testCase.correct ? "✅ Passed" : "❌ Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!dailyChallenge && (
        <div className="button-group mt-4 justify-center items-center flex">
        <button
          onClick={handleFinish}
          className="bg-blue-500 p-2 rounded-3xl hover:bg-blue-700 transition w-1/5"
        >
          Finish
        </button>
      </div>
      )}
      
    </div>
  );
};

export default CodeEditor;
