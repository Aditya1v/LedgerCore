const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Operational errors (AppError)
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Unexpected errors
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorMiddleware;