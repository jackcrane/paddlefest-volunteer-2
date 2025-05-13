import Handlebars from 'handlebars';
import fs from 'fs';
import { client } from '../util/prisma-client.js';
import moment from 'moment-timezone';
import sgMail from '@sendgrid/mail';
import { ServerClient } from 'postmark';
const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN);

export async function generateEmail(id) {
	try {
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
				id: shift.shift.job.id,
				name: shift.shift.job.name,
				location: shift.shift.job.location,
				day: shift.shift.job.location.slug === 'Expo' ? 'Friday 8/2' : 'Saturday 8/3',
				shifts: [
					{
						startTime: shift.shift.startTime,
						endTime: shift.shift.endTime,
					},
				],
			};
		});

		const tz_offset = new Date().getTimezoneOffset() / 60;

		const newJobs = [];
		jobs.forEach((job) => {
			const existingJob = newJobs.find((newJob) => newJob.id === job.id);
			if (existingJob) {
				existingJob.shifts.push(
					...job.shifts.map((shift) => ({
						...shift,
						timeString:
							moment(shift.startTime).minutes() === 37
								? 'Times TBA. Keep an eye out for an email with more information.'
								: `${moment(shift.startTime).add(tz_offset, 'hours').format('h:mm A')} - ${moment(
										shift.endTime
								  )
										.add(tz_offset, 'hours')
										.format('h:mm A')}`,
					}))
				);
			} else {
				newJobs.push({
					...job,
					shifts: job.shifts.map((shift) => ({
						...shift,
						timeString:
							moment(shift.startTime).add(tz_offset, 'hours').format('h:mm A') +
							' - ' +
							moment(shift.endTime).add(tz_offset, 'hours').format('h:mm A'),
					})),
				});
			}
		});

		// Sort the shifts by start time
		const sortedJobs = newJobs.map((job) => {
			return {
				...job,
				shifts: job.shifts.sort((a, b) => {
					if (moment(a.startTime).isBefore(moment(b.startTime))) return -1;
					if (moment(a.startTime).isAfter(moment(b.startTime))) return 1;
					return 0;
				}),
			};
		});

		volunteer.jobs = sortedJobs;
		delete volunteer.shifts;

		const html = template(volunteer);
		return { html, volunteer };
	} catch (e) {
		console.log(e);
	}
}

export const sendEmail = async (id, update = false) => {
	try {
		const { html, volunteer } = await generateEmail(id);
		const subject = `${update ? '[UPDATED] ' : ''}Paddlefest Volunteer Confirmation`;

		const em = await postmarkClient.sendEmail({
			From: 'Paddlefest Volunteer Coordination <volunteer@jackcrane.rocks>',
			To: volunteer.email,
			Subject: subject,
			HtmlBody: html,
			ReplyTo: 'info@ohioriverpaddlefest.org',
		});
		console.log(em);

		await client.volunteers.update({
			where: { id: volunteer.id },
			data: { emailedAt: new Date() },
		});

		return true;
	} catch (error) {
		throw new Error(error);
	}
};

// async function emailEveryone() {
// 	const volunteers = await client.volunteers.findMany({
// 		where: {
// 			id: {
// 				in: notYetSent,
// 			},
// 		},
// 	});
// 	let failures = [];
// 	for (const volunteer of volunteers) {
// 		console.log(volunteer.id, volunteer.name);
// 		try {
// 			await sendEmail(volunteer.id);
// 			console.log('Sent', volunteer.id, volunteer.name);
// 		} catch (error) {
// 			failures.push(volunteer.id);
// 			console.log('Failed', volunteer.id, volunteer.name);
// 		}
// 	}
// 	console.log(failures);
// }
// emailEveryone();

async function test() {
	try {
		await sendEmail('aeed74d3-ead8-4910-a823-c7e4c571f1d9');
	} catch (error) {
		console.log(error);
	}
}

test();
