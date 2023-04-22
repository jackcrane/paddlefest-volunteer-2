import express from 'express';
import { client } from '../../util/prisma-client.js';
import twilio from 'twilio';
const twclient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const router = express.Router();

router.get('/me', async (req, res) => {
	const accessToken = req.query.accessToken;
	let volunteerId;
	try {
		const token = await client.accessTokens.findFirst({
			where: {
				id: accessToken,
			},
			include: {
				volunteer: true,
			},
		});
		if (!token) {
			res.status(401).json({ error: 'Invalid access token' });
			return;
		} else {
			volunteerId = token.volunteerId;
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
	try {
		const volunteer = await client.volunteers.findUnique({
			where: {
				id: volunteerId,
			},
			include: {
				Waiver: true,
				shifts: {
					include: {
						shift: {
							include: {
								job: true,
							},
						},
					},
				},
			},
		});

		/*
  Reorganize volunteer.shifts array into an object with the following format:
  jobs: [
    {
      id,
      name,
      location,
      shifts: [
        {
          id,
          startTime,
          endTime
        }
      ]
        
    }
  ]
  */

		let jobs = [];
		volunteer.shifts.forEach((shift) => {
			let job = jobs.find((job) => job.id === shift.shift.job.id);
			if (job) {
				job.shifts.push({
					id: shift.shift.id,
					startTime: shift.shift.startTime,
					endTime: shift.shift.endTime,
				});
			} else {
				jobs.push({
					id: shift.shift.job.id,
					name: shift.shift.job.name,
					location: shift.shift.job.location,
					shifts: [
						{
							id: shift.shift.id,
							startTime: shift.shift.startTime,
							endTime: shift.shift.endTime,
						},
					],
				});
			}
		});
		volunteer.jobs = jobs;
		delete volunteer.shifts;

		volunteer.emergency = {
			name: volunteer.Waiver[0].emergencyContactName,
			phone: volunteer.Waiver[0].emergencyContactPhone,
		};

		volunteer.waiver = volunteer.Waiver[0].signed;
		delete volunteer.Waiver;

		res.status(200).json(volunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/send', async (req, res) => {
	try {
		const { email } = req.body;
		const vol = await client.volunteers.findFirst({
			where: {
				email,
			},
		});
		if (!vol) {
			res.status(400).json({ error: 'Invalid email' });
			return;
		}

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
			res.json({ message: 'Sent token' });
		} catch (error) {
			res.status(500).json({ error: 'Could not send message' });
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Something went wrong' });
		return;
	}
});

router.post('/verify', async (req, res) => {
	try {
		const { email, code } = req.body;
		const verification = await client.verifications.findFirst({
			where: {
				token: code,
				volunteer: {
					email,
				},
			},
		});
		if (!verification) {
			res.status(400).json({ error: 'Invalid code' });
			return;
		}
		if (verification.expiresAt < new Date()) {
			res.status(400).json({ error: 'Code expired' });
			return;
		}
		await client.verifications.update({
			where: {
				id: verification.id,
			},
			data: {
				verified: true,
			},
		});
		const volunteer = await client.volunteers.findFirst({
			where: {
				email,
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
		res.json({ accessToken: accessToken.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Something went wrong' });
		return;
	}
});

export default router;
