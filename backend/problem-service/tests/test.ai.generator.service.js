import aiGeneratorService from '../src/services/aiGeneratorService.js';

async function testAIService() {
  const baseProblem = {
    title: 'Example Problem',
    description: 'Write a code that returns the reverse of the input list.',
    difficulty: 'Easy',
    tags: ['arrays'],
    testCases: [{ input: '[1, 2, 3]', output: '[3, 2, 1]' }],
  };

  const params = { variationOptions: ['change into a different array question'] };

  try {
    const generatedProblem = await aiGeneratorService.generateVariant(baseProblem, params);

    console.log('Generated problem:', JSON.stringify(generatedProblem, null, 2));
  } catch (err) {
    console.error('Error generating problem:', err.message || err);
  }
}

testAIService();