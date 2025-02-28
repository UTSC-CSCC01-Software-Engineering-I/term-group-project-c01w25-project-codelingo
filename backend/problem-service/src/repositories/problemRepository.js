import { db } from '../../../shared/initFirebase.js';
import { ref, query, orderByChild, equalTo, limitToFirst, get, push, set } from 'firebase/database';

const problemRef = ref(db, 'problems');

export default {
  async getRandomProblem({ tags, difficulty }) {
    try {
      let q = query(problemRef);

      if (tags) {
        q = query(q, orderByChild('tags'), equalTo(tags));
      }

      if (difficulty) {
        q = query(q, orderByChild('difficulty'), equalTo(difficulty));
      }

      q = query(q, orderByChild('usedCount'), limitToFirst(10));
      const snapshot = await get(q);

      if (!snapshot.exists()) {
        throw new Error('No matching problems found');
      }

      const problems = Object.values(snapshot.val());
      return problems[Math.floor(Math.random() * problems.length)];
    } catch (err) {
      console.error('Error fetching random problem:', err);
      throw new Error('Failed to fetch a random problem');
    }
  },

  async createProblem(problem) {
    try {
      const newProblemRef = push(problemRef);
      await set(newProblemRef, problem);
      return { ...problem, id: newProblemRef.key };
    } catch (err) {
      console.error('Error creating problem:', err);
      throw new Error('Failed to create problem');
    }
  }
};