import express from 'express';
import { client } from '#util/prisma-client.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { location: slug } = req.query;
	try {
		let jobs = await client.jobs.findMany({
			include: {
				shifts: {
					include: {
						volunteers: true,
					},
				},
				location: true,
				restrictions: true,
			},
			where: {
				location: {
					slug,
				},
			},
		});

		jobs = jobs.map((job) => {
			job.shifts = job.shifts.map((shift) => {
				shift.volunteers = shift.volunteers.length;
				return shift;
			});
			return job;
		});

		res.json(jobs);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
