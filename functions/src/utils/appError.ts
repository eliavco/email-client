module.exports = class extends Error {
	isOperational: boolean;
	statusCode: number;
	status: string;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith('4')
			? 'failure'
			: 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
};