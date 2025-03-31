import { db } from "../../shared/initFirebase.js";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  push,
  set,
  update,
} from "firebase/database";

const problemRef = ref(db, "problems");

export default {
  async getRandomProblem({ problemType, problemDifficulty, tags }) {
    try {
      let q = problemRef;

      if (problemType) {
        q = query(q, orderByChild("problemType"), equalTo(problemType));
      } else if (problemDifficulty) {
        const difficultyInt = parseInt(problemDifficulty, 10);
        q = query(q, orderByChild("problemDifficulty"), equalTo(difficultyInt));
      }

      const snapshot = await get(q);

      if (!snapshot.exists()) {
        throw new Error("No matching problems found 1");
      }

      let problems = Object.values(snapshot.val());

      if (problemType && problemDifficulty) {
        const difficultyInt = parseInt(problemDifficulty, 10);
        problems = problems.filter(
          (problem) => problem.problemDifficulty === difficultyInt
        );
      }

      if (Array.isArray(tags) && tags.length > 0) {
        problems = problems.filter(
          (problem) =>
            problem.tags && problem.tags.some((tag) => tags.includes(tag))
        );
      }

      if (problems.length === 0) {
        throw new Error("No matching problems found 2");
      }

      return problems[Math.floor(Math.random() * problems.length)];
    } catch (error) {
      console.error("Error fetching random problem:", error);
      throw new Error("Failed to fetch a random problem");
    }
  },

  async createProblem(problem) {
    try {
      const newProblemRef = push(problemRef);
      await set(newProblemRef, problem);

      if (problem.tags && Array.isArray(problem.tags)) {
        for (const tag of problem.tags) {
          const tagRef = ref(db, `tags/${tag}`);

          const snapshot = await get(tagRef);
          if (snapshot.exists()) {
            const currentCount = snapshot.val().count;
            await update(tagRef, { count: currentCount + 1 });
          } else {
            await set(tagRef, { tag, count: 1 });
          }
        }
      }

      return { ...problem, id: newProblemRef.key };
    } catch (error) {
      console.error("Error creating problem:", error);
      throw new Error("Failed to create problem");
    }
  },
};
