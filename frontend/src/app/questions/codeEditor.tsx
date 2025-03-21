import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { runCode } from "./problemApi";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CodeEditor = () => {
  const location = useLocation();

  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(location.state?.problem || {});
  const [result, setResult] = useState({});

  // State for Save Code feature
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [accessToken, setAccessToken] = useState(""); // Assume this is set elsewhere after OAuth

  const getParameterString = () => {
    return Object.keys(problem.testCases[0].input).join(", ");
  };
  const [code, setCode] = useState(`def run(${getParameterString()}):\n`);

  useEffect(() => {
    setLoading(Object.keys(problem).length === 0);
  }, [problem]);

  const defaultCode = {
    python: `def run(${getParameterString()}):\n`,
    cpp: `#include <iostream>\nusing namespace std;\n\nvoid run() {\n    \n}`,
    java: `public class Main {\n    public static void run() {\n        \n    }\n}`,
  };

  const calculateResult = () => {
    let amountCorrect = 0;
    for (let i = 0; i < result.results.length; i++) {
      const testcaseResult = result.results[i];
      if (testcaseResult.correct) {
        amountCorrect++;
      }
    }
    setOutput(`${amountCorrect}/${result.results.length}`);
  };

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
      const result = await runCode(language, code, problem.testCases);
      await setResult(result);
      calculateResult();
    } catch (error) {
      console.log(error);
      await setOutput("Error running code.");
    }
  };

  const handleSaveCode = () => {
    setIsPopupOpen(true);
  };

  const parseRepositoryUrl = (url) => {
    const match = url.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const username = match[1];
      const repoName = match[2];
      return { username, repoName };
    } else {
      throw new Error("Invalid GitHub repository URL");
    }
  };

  const handleSaveToGithub = async () => {
    try {
      const { username, repoName } = parseRepositoryUrl(repoUrl);

      const response = await axios.put(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
        {
          message: "Add new code file",
          content: btoa(code), // Base64 encode the code
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Code saved to GitHub successfully!");
    } catch (error) {
      console.error("Error saving to GitHub: ", error);
      alert("Failed to save code to GitHub.");
    }
    setIsPopupOpen(false);
  };

  const stringify = (value) => {
    return JSON.stringify(value, null, 2);
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-3/4 w-3/4 mt-10  ">
      {loading ? (
        <h2 className="text-lg font-bold mb-10">Loading...</h2>
      ) : (
        <div>
          <h2 className="text-lg font-bold">{problem?.title}</h2>
          <div className="tag-container">
            {problem.tags.map((tag, index) => (
              <span
                key={index}
                className="tag bg-sky-200 text-xs text-black rounded-full px-3 py-1 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-8 mb-4">{problem?.problemDescription}</p>
          <p>Sample test cases: </p>
          <div className="test-cases-container">
            {problem.testCases.slice(0, 2).map((testCase, index) => (
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
        <button
          className="bg-green-500 p-2 rounded hover:bg-green-600 transition"
          onClick={handleSaveCode}
        >
          Save Code
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
        {problem.constraints.map((constraint, index) => (
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

      {isPopupOpen && (
        <div className="popup fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup-inner bg-white p-6 rounded shadow-lg text-black">
            <h3 className="font-bold mb-4">Save to GitHub</h3>
            <label className="block font-medium">
              GitHub Repository URL:
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="block p-2 border border-gray-300 rounded mt-2 mb-4 w-full"
                placeholder="https://github.com/username/repo"
              />
            </label>
            <label className="block font-medium">
              Filename:
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="block p-2 border border-gray-300 rounded mt-2 mb-4 w-full"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={handleSaveToGithub}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;