import dotenv from 'dotenv';
dotenv.config();
console.log(process.env);

import express from 'express';
const app = express();
const router = express.Router();
import cors from 'cors';
app.use(cors());
app.use(express.json());
app.use('/', router);

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path} ${req.ip}`);
	next();
});

app.use(express.static('../app/build'));

import shifts from './routes/shifts.js';
import jobs from './routes/jobs.js';
import signup from './routes/signup.js';
import info from './routes/info.js';
import admin from './routes/admin.js';

router.use('/shifts', shifts);
router.use('/jobs', jobs);
router.use('/signup', signup);
router.use('/info', info);
router.use('/admin', admin);

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(3100, () => console.log('Server running'));
