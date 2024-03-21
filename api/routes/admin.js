import express from 'express';
import { client } from '../../util/prisma-client.js';
import { sendEmail, testEmail } from '../process-email.js';
import fs from 'fs';

const router = express.Router();

router.use(express.static('../admin/build'));

router.get('/delete-all', async (req, res) => {
	res.send('This route is disabled');
	return; // Disable this route
	// Delete all volunteers. To do that, we need to delete all waivers and all volunteersShifts
	await client.volunteersShifts.deleteMany();
	await client.waiver.deleteMany();
	await client.volunteers.deleteMany();
	res.send('Deleted all volunteers');
});

// Volunteers
router.get('/volunteers', async (req, res) => {
	try {
		const volunteers = await client.volunteers.findMany({
			include: {
				shifts: {
					include: {
						shift: {
							include: {
								volunteers: true,
								job: {
									include: {
										location: true,
									},
								},
							},
						},
					},
				},
				Waiver: true,
			},
		});
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete('/volunteers/:id', async (req, res) => {
	const { id } = req.params;
	try {
		// First, remove all volunteersShifts and waivers, then delete the volunteer
		await client.volunteersShifts.deleteMany({ where: { volunteerId: id } });
		await client.waiver.deleteMany({ where: { volunteerId: id } });
		await client.volunteers.delete({ where: { id } });
		res.json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/volunteers/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const volunteer = await client.volunteers.findUnique({
			where: { id },
			include: {
				shifts: {
					include: {
						shift: {
							include: {
								volunteers: true,
								job: {
									include: {
										location: true,
									},
								},
							},
						},
					},
				},
				Waiver: true,
			},
		});
		res.json(volunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/volunteer/:volunteerId/shift/:shiftId', async (req, res) => {
	const { volunteerId, shiftId } = req.params;
	const { selected } = req.body;
	try {
		const volunteer = await client.volunteers.findUnique({
			where: { id: volunteerId },
			include: { shifts: true },
		});
		const shift = await client.shifts.findUnique({
			where: { id: shiftId },
			include: { volunteers: true },
		});
		if (selected) {
			await client.volunteersShifts.create({
				data: {
					shiftId,
					volunteerId,
				},
			});
		} else {
			const vs = await client.volunteersShifts.findFirst({
				where: {
					shiftId,
					volunteerId,
				},
			});

			await client.volunteersShifts.delete({
				where: {
					id: vs.id,
				},
			});
		}
		res.json({ message: 'Success' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

router.put('/volunteers/:id', async (req, res) => {
	const { id } = req.params;
	const { name, email, phone, shirtSize, referral, createdAt, updatedAt, emailedAt, Waiver } =
		req.body;

	try {
		const volunteer = await client.volunteers.update({
			where: { id },
			data: {
				name,
				email,
				phone,
				shirtSize,
				referral,
				createdAt,
				updatedAt,
				emailedAt,
			},
		});

		// Update the waiver
		if (Waiver && Waiver.length > 0) {
			for (let waiver of Waiver) {
				await client.waiver.update({
					where: { id: waiver.id },
					data: waiver,
				});
			}
		}

		const newVolunteer = await client.volunteers.findUnique({
			where: { id },
			include: {
				shifts: {
					include: {
						shift: {
							include: {
								volunteers: true,
								job: {
									include: {
										location: true,
									},
								},
							},
						},
					},
				},
				Waiver: true,
			},
		});

		console.log(req.query);
		if (req.query.sendEmail === 'true') {
			try {
				let e = await sendEmail(id, true);
				console.log(e);
			} catch (error) {
				console.log(error);
			}
		}

		res.json(newVolunteer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

// Shifts
router.get('/shifts', async (req, res) => {
	try {
		const shifts = await client.shifts.findMany({ include: { volunteers: true, job: true } });
		res.json(shifts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/shifts/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const shift = await client.shifts.findUnique({
			where: { id },
			include: { volunteers: true, job: true },
		});
		res.json(shift);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/shifts/:id', async (req, res) => {
	const { id } = req.params;
	const shiftData = req.body;
	try {
		const updatedShift = await client.shifts.update({ where: { id }, data: shiftData });
		res.json(updatedShift);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Jobs
router.get('/jobs', async (req, res) => {
	try {
		const jobs = await client.jobs.findMany({
			include: {
				shifts: { include: { volunteers: { include: { volunteer: true } } } },
				location: true,
				restrictions: true,
			},
		});
		res.json(jobs);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/jobs/:id', async (req, res) => {
	const { id } = req.params;
	const jobData = req.body;
	try {
		const updatedJob = await client.jobs.update({ where: { id }, data: jobData });
		res.json(updatedJob);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/jobs', async (req, res) => {
	const jobData = req.body;
	console.log(jobData);
	const { shifts, name, description, location } = jobData;

	try {
		const newJob = await client.jobs.create({
			data: {
				name,
				description,
				location: {
					connect: {
						id: location.id,
					},
				},
			},
		});

		for (let shift of shifts) {
			await client.shifts.create({
				data: {
					startTime: new Date(shift.startTime),
					endTime: new Date(shift.endTime),
					capacity: parseInt(shift.capacity),
					job: {
						connect: {
							id: newJob.id,
						},
					},
				},
			});
		}

		res.json(newJob);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.error(error);
	}
});

router.delete('/jobs/:id', async (req, res) => {
	const { id } = req.params;
	try {
		// First, un-sign up all volunteers from all shifts in this job
		// Then delete the restrictions
		// Then delete the shifts
		// Then delete the job
		const shifts = await client.shifts.findMany({ where: { jobId: id } });
		for (let shift of shifts) {
			await client.volunteersShifts.deleteMany({ where: { shiftId: shift.id } });
		}
		await client.shifts.deleteMany({ where: { jobId: id } });
		await client.restrictions.deleteMany({ where: { jobId: id } });
		await client.jobs.delete({ where: { id } });
		res.json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/email-volunteer', async (req, res) => {
	// Email the volunteer their updated information
	const { id } = req.body;
	try {
		await sendEmail(id, true);
		res.json({ message: 'Email sent' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
