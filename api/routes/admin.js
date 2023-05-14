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

router.put('/volunteers/:id', async (req, res) => {
	const { id } = req.params;
	const volunteerData = req.body;
	try {
		if (volunteerData.emergencyContactName) {
			const waiverId = (
				await client.volunteers.findUnique({
					where: { id },
					select: { Waiver: true },
				})
			).Waiver[0].id;
			const updatedVolunteer = await client.waiver.update({
				where: { id: waiverId },
				data: {
					emergencyContactName: volunteerData.emergencyContactName,
				},
			});
			await client.volunteers.update({
				where: { id },
				data: {
					updatedAt: new Date(),
				},
			});
			return res.json(updatedVolunteer);
		} else if (volunteerData.emergencyContactPhone) {
			const waiverId = (
				await client.volunteers.findUnique({
					where: { id },
					select: { Waiver: true },
				})
			).Waiver[0].id;
			const updatedVolunteer = await client.waiver.update({
				where: { id: waiverId },
				data: {
					emergencyContactPhone: volunteerData.emergencyContactPhone,
				},
			});
			await client.volunteers.update({
				where: { id },
				data: {
					updatedAt: new Date(),
				},
			});
			return res.json(updatedVolunteer);
		} else {
			const updatedVolunteer = await client.volunteers.update({
				where: { id },
				data: volunteerData,
			});
			res.json(updatedVolunteer);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.error(error);
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
			include: { shifts: { include: { volunteers: true } }, location: true, restrictions: true },
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

router.post('/update-volunteer', async (req, res) => {
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
