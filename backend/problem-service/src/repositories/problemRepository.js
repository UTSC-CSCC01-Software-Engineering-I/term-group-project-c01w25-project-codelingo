import { db } from '../../../shared/initFirebase.js';
import { ref, query, orderByChild, equalTo, get, push, set } from 'firebase/database';

const problemRef = ref(db, 'problems');

export default {
  async getRandomProblem({ problemType, problemDifficulty, tags }) {
    try {
      let q = problemRef;

      if (problemType) {
        q = query(q, orderByChild('problemType'), equalTo(problemType));
      } else if (problemDifficulty) {
        const difficultyInt = parseInt(problemDifficulty, 10);
        q = query(q, orderByChild('problemDifficulty'), equalTo(difficultyInt));
      }
    
      const snapshot = await get(q);
    
      if (!snapshot.exists()) {
        throw new Error('No matching problems found');
      }
    
      let problems = Object.values(snapshot.val());

      if (problemType && problemDifficulty) {
        const difficultyInt = parseInt(problemDifficulty, 10);
        problems = problems.filter(problem =>
          problem.problemDifficulty === difficultyInt
        );
      }
    
      if (tags) {
        const searchTags = Array.isArray(tags) ? tags : [tags];
        problems = problems.filter(problem =>
          problem.tags && problem.tags.some(tag => searchTags.includes(tag))
        );
      }
    
      if (problems.length === 0) {
        throw new Error('No matching problems found');
      }

      return problems[Math.floor(Math.random() * problems.length)];
    } catch (error) {
        console.error('Error fetching random problem:', error);
        throw new Error('Failed to fetch a random problem');
    }
  },      

  // use if we want to store the generated question in the database
  async createProblem(problem) {
    try {
      const newProblemRef = push(problemRef);
      await set(newProblemRef, problem);
      return { ...problem, id: newProblemRef.key };
    } catch (error) {
      console.error('Error creating problem:', error);
      throw new Error('Failed to create problem');
    }
  }
};