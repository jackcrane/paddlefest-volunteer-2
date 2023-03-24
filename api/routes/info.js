import express from 'express';
import { client } from '../../util/prisma-client.js';
import { generateEmail } from '../process-email.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
	const volunteerId = req.params.id;
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
		console.log(shift);
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

	console.log(volunteer);
	res.status(200).json(volunteer);
});

router.get('/registration/:id', async (req, res) => {
	const reg = await generateEmail(req.params.id);
	res.status(200).send(reg.html);
});

export default router;
