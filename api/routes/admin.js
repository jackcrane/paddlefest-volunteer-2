import express from 'express';
import { client } from '../../util/prisma-client.js';
import { testEmail } from '../process-email.js';
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
			include: { shifts: true, Waiver: true },
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
		const updatedVolunteer = await client.volunteers.update({ where: { id }, data: volunteerData });
		res.json(updatedVolunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
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

export default router;
