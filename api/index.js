import dotenv from 'dotenv';
dotenv.config();

console.log('Hello World');

import express from 'express';
const app = express();
import ws from 'express-ws';
ws(app);
const router = express.Router();
import cors from 'cors';
import twilio from 'twilio';
const twclient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

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
import volunteers from './routes/volunteers.js';
import { client } from '../util/prisma-client.js';

router.use('/shifts', shifts);
router.use('/jobs', jobs);
router.use('/signup', signup);
router.use('/info', info);
router.use('/admin', admin);

router.use('/volunteer', volunteers);

router.ws('/volunteer-auth', (ws, req) => {
	ws.on('message', async (msg) => {
		try {
			let message;
			try {
				message = JSON.parse(msg);
			} catch (error) {
				ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
				return;
			}
			if (typeof message.type !== 'string') {
				ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
				return;
			}
			if (message.type === 'auth') {
				const vol = await client.volunteers.findFirst({
					where: {
						email: message.email,
					},
				});
				if (!vol) {
					ws.send(JSON.stringify({ type: 'error', message: 'Invalid email' }));
					return;
				}
				ws.send(JSON.stringify({ type: 'working', message: 'Sending token' }));

				// Generate random 6 digit code
				const code = Math.floor(100000 + Math.random() * 900000);

				// Save code to database
				await client.verifications.create({
					data: {
						token: code.toString(),
						expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
						volunteer: {
							connect: {
								id: vol.id,
							},
						},
					},
				});

				try {
					await twclient.messages.create({
						body: `Your Paddlefest verification code is ${code}. Paddlefest will not ask for your code. If you did not request a code, please ignore this message.`,
						from: process.env.TWILIO_PHONE,
						to: vol.phone,
					});
					ws.send(JSON.stringify({ type: 'working', message: 'Sent token' }));
				} catch (error) {
					ws.send(JSON.stringify({ type: 'error', message: 'Could not send message' }));
					return;
				}
			}
			if (message.type === 'verify') {
				const code = await client.verifications.findFirst({
					where: {
						token: message.code,
						volunteer: {
							email: message.email,
						},
					},
				});
				if (!code) {
					ws.send(JSON.stringify({ type: 'error', message: 'Invalid code' }));
					return;
				}
				if (code.expiresAt < new Date()) {
					ws.send(JSON.stringify({ type: 'error', message: 'Code expired' }));
					return;
				}
				await client.verifications.update({
					where: {
						id: code.id,
					},
					data: {
						verified: true,
					},
				});
				const volunteer = await client.volunteers.findFirst({
					where: {
						email: message.email,
					},
					select: {
						id: true,
					},
				});
				const accessToken = await client.accessTokens.create({
					data: {
						expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28), // 28 days
						volunteerId: volunteer.id,
					},
				});
				ws.send(JSON.stringify({ type: 'success', accessToken: accessToken.id }));
			}
		} catch (error) {
			console.log(error);
			ws.send(JSON.stringify({ type: 'error', message: 'something went wrong' }));
			return;
		}
	});
	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(3100, () => console.log('Server running'));
