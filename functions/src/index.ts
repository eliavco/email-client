//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import process = require('process');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const multer = require('multer');
// const dotenv = require('dotenv');
const mongoose = require('mongoose');

const emailRouter = require('./routes/emailRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const fs = require('fs');

fs.readFileSync(__dirname + '/config.env', 'utf8').split('\r\n').forEach((line: string) => {
	if (line.indexOf('=') > -1) {
		process.env[line.substring(0, line.indexOf('='))] = line.substring(line.indexOf('=') + 1);
	}
});

// Change Between local and remote connections:
//  change DB value to O in config.env
//  open a server by typing 'mongod' in a powershell
const DBOnline = process.env.DATABASE!.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD!
);
const DBLocal = process.env.DATABASE_LOCAL;
const DB = process.env.DB === 'L' ? DBLocal : DBOnline;
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: process.env.FUNCTIONS_EMULATOR ? true : false,
	})
	.then(() => {
		// console.log('DB connected');
	});

//initialize firebase inorder to access its services
if (process.env.FUNCTIONS_EMULATOR) {
	const serviceAccount = require('./../serviceAccount.json');
	const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG!);
	adminConfig.credential = admin.credential.cert(serviceAccount);
	admin.initializeApp(adminConfig);
} else {
	admin.initializeApp(functions.config().firebase);
}

//initialize express server
const app = express();
const main = express();

if (process.env.FUNCTIONS_EMULATOR) app.use(morgan('dev'));

main.use(async (req: any, res, next) => {
	const cb = res.send;
	res.send = function (body) {
		// tslint:disable-next-line: no-invalid-this
		const tres = cb.call(this, body);
		req.db = undefined;
		req.st = undefined;
		req.dbm = undefined;
		req.makeQuery = undefined;
		return tres;
	};
	next();
});

// Enable CORS
main.enable('trust proxy');
main.use(cors());
main.options('*', cors());

const db = admin.firestore();
const bucket = admin.storage().bucket();

main.use(multer().none());
// HELMET
main.use(helmet());
main.use((req: any, res, next) => {
	req.requestTime = new Date().toISOString();
	req.db = db;
	req.st = bucket;
	next();
});

main.post('/submit', async (req: any, res: any, next) => {
	// incoming mails
	console.log('ok');
	console.log(process.env.DATABASE!);
	res.status(201).json({ status: 'OK' });
});

// Rate limit
const limiter = rateLimit({
	max: 250,
	windowMs: 60 * 60 * 1000,
	message: {
		status: 'error',
		message: 'Too many requests, please try again later'
	},
	handler: function (req: any, res: any) {
		// tslint:disable-next-line: no-invalid-this
		res.status(this.statusCode).json(this.message);
	}
});
main.use(limiter);

// Sanitization
main.use(helmet.xssFilter());
main.use(
	hpp({
		whitelist: ['order']
	})
);
main.use(compression());

main.use(express.urlencoded({ extended: true }));
main.use(express.json({
	limit: '200kb'
}));
main.use(cookieParser());

//add the path to receive request and set json as bodyParser to process the body
const apiVersion = 1;
main.use(`/api/v${apiVersion}`, app);

app.get('/try', async (req, res) => {
	res.status(200).json({ status: 'OK' });
});

app.use('/emails', emailRouter);

app.all('/*', async (req, res, next) => {
	next(new AppError(`The URL path ${req.originalUrl} was not found`, 404));
});

// ERROR HANDLING FUNCTION
app.use(globalErrorHandler);

//define google cloud function name
//export const webApi = functions.https.onRequest(main);