const AppError = require('./../utils/appError');

const handleCastErrorDB = (err: any) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err: any) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
	const errors = Object.values(err.errors).map((el: any) => el.message);
	const value = errors.join('. ');
	const message = `Invalid Input Data: ${value}`;
	return new AppError(message, 400);
};

const handleTokenValidationError = () => new AppError('Invalid Token', 401);

const handleTokenExpirationError = () => new AppError('Token Expired', 403);

const sendErrorDev = (err: any, req: any, res: any) => {
	return res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err: any, req: any, res: any) => {
	if (err.isOperational)
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	// eslint-disable-next-line no-console
	console.error('Error 💣 ', err);
	return res.status(500).json({
		status: 'error',
		message: 'Something went wrong'
	});
};

const sendErrorElse = (req: any, res: any) => {
	return res.status(500).json({
		status: 'error',
		message: 'There is a problem with the server'
	});
};

module.exports = (err: any, req: any, res: any, next: any) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.FUNCTIONS_EMULATOR) {
		sendErrorDev(err, req, res);
	} else {
		let error = { ...err };
		error.message = err.message;
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 1000) error = handleDuplicateFieldsErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError')
			error = handleTokenValidationError();
		if (error.name === 'TokenExpiredError')
			error = handleTokenExpirationError();
	
		sendErrorProd(error, req, res);
	}
};