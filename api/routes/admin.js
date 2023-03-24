import express from 'express';
import { client } from '../../util/prisma-client.js';

const router = express.Router();

router.get('/delete-all', async (req, res) => {
	return; // Disable this route
	// Delete all volunteers. To do that, we need to delete all waivers and all volunteersShifts
	await client.volunteersShifts.deleteMany();
	await client.waiver.deleteMany();
	await client.volunteers.deleteMany();
	res.send('Deleted all volunteers');
});

export default router;
