const errorHandler = (err, req, res, next) => {//kan fe error bsbb el eslint fa claude 2aly 23ml el config.js file dah
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field — record already exists' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack:   process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;