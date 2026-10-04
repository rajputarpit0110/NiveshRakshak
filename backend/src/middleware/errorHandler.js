const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] [REQ ${req.id || 'N/A'}]`, err.message);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    requestId: req.id
  });
};

module.exports = errorHandler;
