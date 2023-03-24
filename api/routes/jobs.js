import express from 'express';
import { client } from '#util/prisma-client.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { location: slug } = req.query;

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
		console.log(job);
		job.shifts = job.shifts.map((shift) => {
			shift.volunteers = shift.volunteers.length;
			return shift;
		});
		return job;
	});

	res.json(jobs);
});

export default router;
