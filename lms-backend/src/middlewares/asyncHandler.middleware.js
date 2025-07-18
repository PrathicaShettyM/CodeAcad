// async handler middleware to catch errors in async functions
const asyncHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next)
            .catch((error) => {
                next(error);
            });
    };
};

export default asyncHandler;
