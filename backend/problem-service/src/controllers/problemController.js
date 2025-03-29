import { db } from '../../../shared/initFirebase.js';
// import database from "../../../shared/firebaseConfig.js";
import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
  update,
  set,
} from "firebase/database";
import problemService from "../services/problemService.js";
import { exec } from "child_process";

// Allowable problem types
const allowableTypes = ["coding", "mcq", "fill"];

export const addProblem = (req, res) => {
  const {
    title,
    problemType,
    problemDifficulty,
    problemDescription,
    tags,
    testCases, // Only for code
    constraints, // Only for code
    options, // Only for mcq
    correctAnswer, // Only for fill
    verified,
    createdAt,
  } = req.body;

  if (
    title == null ||
    problemType == null ||
    problemDifficulty == null ||
    problemDescription == null
  ) {
    return res
      .status(400)
      .send(
        "All fields (title, problemType, problemDifficulty, problemDescription) are required."
      );
  }

  if (!allowableTypes.includes(problemType)) {
    return res
      .status(400)
      .send(
        `Problem type must be one of the following: ${allowableTypes.join(
          ", "
        )}`
      );
  }

  if (problemDifficulty < 1 || problemDifficulty > 10) {
    return res.status(400).send("Problem difficulty must be between 1 and 10.");
  }

  const newProblemRef = ref(db, "problems");
  push(newProblemRef, {
    title,
    problemType,
    problemDifficulty,
    problemDescription,
    tags,
    testCases, // Only for coding
    constraints, // Only for coding
    options, // Only for mcq
    correctAnswer, // Only for fill
    verified,
    createdAt,
  })
    .then(() => {
tags.forEach((tag) => {
      const tagRef = ref(db, `tags/${tag}`);

      get(tagRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const currentCount = snapshot.val().count;
            update(tagRef, { count: currentCount + 1 });
          } else {
            set(tagRef, {
              tag,
              count: 1,
            });
          }
        })
        .catch((error) => {
          console.error("Error updating tags:", error);
        });
      });

      res.status(201).send("Problem added successfully.");
    })
    .catch((error) => {
      console.error("Error adding problem:", error);
      res.status(500).send("Internal Server Error");
    });
};

// Get problems by difficulty
export const getProblemsByDifficulty = (req, res) => {
  const { difficulty } = req.query;

  if (!difficulty) {
    return res.status(400).send("Difficulty is required.");
  }

  // Convert difficulty to integer
  const difficultyInt = parseInt(difficulty, 10);

  const problemsRef = ref(db, "problems");
  const difficultyQuery = query(
    problemsRef,
    orderByChild("problemDifficulty"),
    equalTo(difficultyInt)
  );

  get(difficultyQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.val());
      } else {
        res
          .status(404)
          .send("No problems found with the specified difficulty.");
      }
    })
    .catch((error) => {
      console.error("Error fetching problems by difficulty:", error);
      res.status(500).send("Internal Server Error");
    });
};

// Get problems by type
export const getProblemsByType = (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).send("Problem type is required.");
  }

  const problemsRef = ref(db, "problems");
  const typeQuery = query(
    problemsRef,
    orderByChild("problemType"),
    equalTo(type)
  );

  get(typeQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.val());
      } else {
        res.status(404).send("No problems found for the specified type.");
      }
    })
    .catch((error) => {
      console.error("Error fetching problems by type:", error);
      res.status(500).send("Internal Server Error");
    });
};

export const getProblemsByTags = async (req, res) => {
  let { tags } = req.query;

  if (!tags) {
    return res.status(400).send("Problem tag is required.");
  }

  const problemsRef = ref(db, "problems");

  try {
    const snapshot = await get(problemsRef);
    if (!snapshot.exists()) {
      return res.status(404).send("No problems found.");
    }

    const searchTags = Array.isArray(tags) ? tags : tags.split(",");

    const allProblems = Object.values(snapshot.val() || {});
    const filteredProblems = allProblems.filter(
      (problem) =>
        problem.tags && problem.tags.some((tag) => searchTags.includes(tag))
    );

    if (filteredProblems.length === 0) {
      return res.status(404).send("No problems found for the specified tags.");
    }

    res.status(200).json(filteredProblems);
  } catch (error) {
    console.error("Error fetching problems by tag:", error);
    res.status(500).send("Internal Server Error");
  }
};

// AI generate problem
export const generateProblem = async (req, res) => {
  try {
    const { problemType, problemDifficulty, tags, userOptions } = req.body;
    console.log("req.body:", req.body);

    if (!problemType || !problemDifficulty) {
      return res
        .status(400)
        .json({ error: "Missing parameters in the request body" });
    }

    const newProblem = await problemService.generateProblem({
      problemType,
      problemDifficulty,
      tags,
      userOptions,
    });

    if (!newProblem) {
      return res.status(500).json({ error: "Failed to generate problem" });
    }

    res.status(200).json(newProblem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getProblemsAll = async (req, res) => {
  const problemsRef = ref(db, "problems");

  try {
    const snapshot = await get(problemsRef);
    if (!snapshot.exists()) {
      return res.status(404).send("No problems found.");
    }

    const allProblems = snapshot.val();
    res.status(200).json(allProblems);
  } catch (error) {
    console.error("Error fetching all problems:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const executeCode = (req, res) => {
  const { language, code, testCases } = req.body;

  if (language !== "python") {
    return res.status(400).json({ error: "Unsupported language" });
  }

  // Generate test case print statements
  let modifiedCode = code + "\n"; // Start with user's function

  testCases.forEach((testCase) => {
    // Extract the values in order, join them as arguments
    const args = Object.values(testCase.input)
      .map((value) => JSON.stringify(value)) // Ensure correct Python formatting
      .join(", ");

    modifiedCode += `print(run(${args}))\n`;
  });

  // Execute the modified Python code
  exec(
    `python3 -c "${modifiedCode.replace(/"/g, '\\"')}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
        return res.status(500).json({ error: stderr });
      }

      // Process stdout and compare results
      const outputLines = stdout.trim().split("\n");
      const results = testCases.map((testCase, index) => ({
        input: testCase,
        expected: testCase.output,
        actual:
          outputLines[index] !== undefined ? outputLines[index].trim() : null,
        correct:
          outputLines[index] &&
          outputLines[index].trim() === String(testCase.output),
      }));
      return res.json({ results });
    }
  );
};


export const getAllTags = async (req, res) => {
  const tagsRef = ref(db, "tags");

  try {
    const snapshot = await get(tagsRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ message: "No tags found." });
    }

    const tagsData = Object.values(snapshot.val());
    tagsData.sort((a, b) => b.count - a.count);

    res.status(200).json(tagsData);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

