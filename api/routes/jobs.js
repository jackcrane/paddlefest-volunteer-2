import express from 'express';
import { client } from '#util/prisma-client.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { location: slug } = req.query;

	const jobs = await client.jobs.findMany({
		include: {
			shifts: true,
			location: true,
		},
		where: {
			location: {
				slug,
			},
		},
	});

	res.json(jobs);
});

export default router;
