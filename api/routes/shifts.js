import express from 'express';
import { client } from '#util/prisma-client.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const shifts = await client.shifts.findMany();

	res.json(shifts);
});

export default router;
