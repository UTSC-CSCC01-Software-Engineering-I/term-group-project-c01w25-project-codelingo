import cron from 'node-cron';
import problemService from './services/problemService.js'; // Adjust as needed

cron.schedule('0 20 * * *', async () => { //change to * * * * * for every minute
  console.log('[Scheduler] Generating daily challenge problems at 12:00 AM...');

  const problemTypes = ["coding", "mcq", "fill"];
  const difficulty = '1';

  for (let i = 0; i < 3; i++) {
    try {
      await problemService.generateChallengeProblem({
        problemType: problemTypes[i % problemTypes.length],
        problemDifficulty: difficulty,
        tags: [],
        userOptions: {},
      });

      console.log(`[Scheduler] Created challenge problem ${i + 1}`);
    } catch (err) {
      console.error(`[Scheduler] Failed to generate problem ${i + 1}:`, err);
    }
  }
});
