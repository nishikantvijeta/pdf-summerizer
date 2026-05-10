export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({
      success: false,
      message: "The uploaded PDF is larger than the configured limit."
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Something went wrong. Please try again." : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
