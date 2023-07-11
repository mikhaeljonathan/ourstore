import AppError from "../utils/AppError.js";

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsErrorDB = (err) => {
    const message = `Duplicate field value: ${JSON.stringify(err.keyValue)}. Please use another value`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = (err) => {
    return new AppError(`${err.message}. Please log in again`, 401);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

const sendErrorProd = (err, res) => {
    // safely send message to the user if it's an operational error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else { // don't leak the error to the user if it's programming or unknown error
        console.error('ERROR', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}


export default function (err, req, res, next) {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // development's error is more verbose
    if (process.env.NODE_ENV === 'development') {

        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}; // copy "err" value to "error" variable
        error.message = err.message;

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsErrorDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') error = handleJWTError(error);

        sendErrorProd(error, res);
    }
    
}