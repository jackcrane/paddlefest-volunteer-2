import Handlebars from 'handlebars';
import fs from 'fs';
import { client } from '../util/prisma-client.js';
import moment from 'moment-timezone';
import sgMail from '@sendgrid/mail';

export async function generateEmail(id) {
	const src = fs.readFileSync('thanks.html', 'utf8');
	const template = Handlebars.compile(src);

	const volunteer = await client.volunteers.findUnique({
		where: {
			id,
		},
		include: {
			shifts: {
				include: {
					shift: {
						include: {
							job: {
								include: {
									location: true,
								},
							},
						},
					},
				},
			},
		},
	});

	const jobs = volunteer.shifts.map((shift) => {
		return {
			name: shift.shift.job.name,
			location: shift.shift.job.location,
			shifts: [
				{
					startTime: shift.shift.startTime,
					endTime: shift.shift.endTime,
				},
			],
		};
	});

	const newJobs = [];
	jobs.forEach((job) => {
		const existingJob = newJobs.find((newJob) => newJob.name === job.name);
		if (existingJob) {
			existingJob.shifts.push(
				...job.shifts.map((shift) => ({
					...shift,
					timeString:
						moment(shift.startTime).tz('America/New_York').format('hh:mm A') +
						' - ' +
						moment(shift.endTime).tz('America/New_York').format('hh:mm A'),
				}))
			);
		} else {
			newJobs.push({
				...job,
				shifts: job.shifts.map((shift) => ({
					...shift,
					timeString:
						moment(shift.startTime).tz('America/New_York').format('hh:mm A') +
						' - ' +
						moment(shift.endTime).tz('America/New_York').format('hh:mm A'),
				})),
			});
		}
	});

	volunteer.jobs = newJobs;
	delete volunteer.shifts;

	const html = template(volunteer);
	return { html, volunteer };
}

export async function sendEmail(id) {
	const { html, volunteer } = await generateEmail(id);
	console.log('SENDGRID API KEY', process.env.SENDGRID_API_KEY);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
		to: volunteer.email,
		from: { email: 'volunteer@jackcrane.rocks', name: 'Paddlefest Volunteer Coordination' },
		replyTo: 'info@ohioriverpaddlefest.org',
		fromname: 'Paddlefest Volunteer Coordination',
		subject: 'Paddlefest Volunteer Confirmation',
		html,
	};
	const f = await sgMail.send(msg);
	console.log('Message sent', f);
}

export async function testEmail() {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
		to: 'jack@jackcrane.rocks',
		from: { email: 'volunteer@jackcrane.rocks', name: 'Paddlefest Volunteer Coordination' },
		subject: 'Paddlefest Volunteer Confirmation',
		text: 'Hello world',
	};
	const f = await sgMail.send(msg);
	console.log('Message sent', f);
}
