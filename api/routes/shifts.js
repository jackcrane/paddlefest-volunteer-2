import express from 'express';
import { client } from '#util/prisma-client.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const shifts = await client.shifts.findMany();

		res.json(shifts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
