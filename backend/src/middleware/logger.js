const crypto = require('crypto');

const requestLogger = (req, res, next) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  req.id = requestId;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log structured metadata only, never raw body with documents or passwords
    console.log(
      `[REQ ${requestId}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
