const AIClient = require('../services/aiClient');
const RiskAnalysis = require('../models/RiskAnalysis');

exports.checkScam = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text to analyze is required.' });
    }

    const result = await AIClient.checkScam(text);

    // Save history if user exists
    try {
      if (req.user?._id) {
        await RiskAnalysis.create({
          userId: req.user._id,
          textExcerpt: text.slice(0, 180),
          riskLevel: result.risk_level,
          riskScore: result.risk_score,
          signals: result.detected_signals,
          recommendedActions: result.recommended_actions
        });
      }
    } catch (e) {}

    res.json(result);
  } catch (error) {
    next(error);
  }
};
