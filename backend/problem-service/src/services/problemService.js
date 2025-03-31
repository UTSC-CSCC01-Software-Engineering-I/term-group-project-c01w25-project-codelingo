import problemRepository from '../repositories/problemRepository.js';
import aiGeneratorService from './aiGeneratorService.js';

export default {
  async generateProblem(param) {
    try {
      const { problemType, problemDifficulty, tags, userOptions } = param;

      if (!problemType || !problemDifficulty) {
        throw new Error('Missing parameters in the request body');
      }

      // get the base question
      const baseProblem = await problemRepository.getRandomProblem({
        problemType,
        problemDifficulty,
        tags
      });

      if (!baseProblem) {
        throw new Error('Failed to get base problem');
      }

      // create variation with AI
      const generated = await aiGeneratorService.generateVariant(baseProblem, userOptions);

      if (!generated) {
        throw new Error('Failed to generate new problem');
      }

      // save created question
      const newProblem = await problemRepository.createProblem(generated);

      if (!newProblem) {
        throw new Error('Failed to create problem');
      }

      return newProblem;

    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};