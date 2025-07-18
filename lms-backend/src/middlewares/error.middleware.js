const errorMiddleware = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500; // default to 500 if no status code is set
    err.message = err.message || 'OOPS!! Something went wrong'; // default message
    
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack, // Include stack trace in the response for debugging
    });
};

export default errorMiddleware;
