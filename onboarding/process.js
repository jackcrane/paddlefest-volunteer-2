import { readFileSync } from 'fs';
let data = readFileSync('volunteer-jobs.json', 'utf8');
data = JSON.parse(data);
import { client } from '#util/prisma-client.js';
import moment from 'moment';

data.forEach(async (job) => {
	const shifts = job.shifts.map((shift) => {
		return {
			startTime: moment(shift.start).add(1, 'year').toDate(),
			endTime: moment(shift.end).add(1, 'year').toDate(),
			capacity: parseInt(shift.max),
		};
	});
	await client.jobs.create({
		data: {
			name: job.title,
			description: job.description,
			location: {
				connect: {
					slug: job.location,
				},
			},
			shifts: {
				create: shifts,
			},
		},
	});
});
