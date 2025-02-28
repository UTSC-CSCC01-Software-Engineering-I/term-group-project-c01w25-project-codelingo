import problemService from '../services/problemService.js';

export default {
  async generateProblem(req, res) {
    console.log(`🔥 API Gateway received request: ${req.method} ${req.url}`);
    console.log(`➡️ Forwarding request to problem service at http://localhost:8083${req.url}`);
    console.log(`📦 Request Body:`, req.body);

    try {
      const { baseDifficulty, tags, variationOptions } = req.body;

      if (!baseDifficulty || !tags || !variationOptions) {
        return res.status(400).json({ error: 'Missing parameters in the request body' });
      }

      const newProblem = await problemService.generateProblem({
        baseDifficulty,
        tags,
        variationOptions
      });

      if (!newProblem) {
        return res.status(500).json({ error: 'Failed to generate problem' });
      }

      res.status(201).json(newProblem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};