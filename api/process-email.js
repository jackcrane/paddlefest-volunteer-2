import Handlebars from 'handlebars';
import fs from 'fs';
import { client } from '../util/prisma-client.js';
import moment from 'moment-timezone';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
const twclient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

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

		const tz_offset = 4;

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

export async function sendEmail(id, update = false) {
	try {
		const { html, volunteer } = await generateEmail(id);
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: volunteer.email,
			from: { email: 'volunteer@jackcrane.rocks', name: 'Paddlefest Volunteer Coordination' },
			replyTo: 'info@ohioriverpaddlefest.org',
			fromname: 'Paddlefest Volunteer Coordination',
			subject: `${update ? '[UPDATED] ' : '[FIXED] '}Paddlefest Volunteer Confirmation`,
			html,
		};
		const f = await sgMail.send(msg);
		// console.log('Message sent', f);

		// Text a url to the user
		if (process.env.TEXT_ENABLED === 'true') {
			await twclient.messages
				.create({
					body: `${
						update
							? 'Your Paddlefest information has been updated.'
							: 'Thanks for volunteering for Paddlefest!'
					} If you have any questions or issues, please feel free to contact us at info@ohioriverpaddlefest.org. You can also view your information at: `,
					from: process.env.TWILIO_PHONE,
					to: volunteer.phone,
				})
				.then((message) => console.log(message.sid));
			await twclient.messages
				.create({
					body: `https://volunteer.jackcrane.rocks/info/registration/${volunteer.id}`,
					from: process.env.TWILIO_PHONE,
					to: volunteer.phone,
				})
				.then((message) => console.log(message.sid));
		}

		await client.volunteers.update({
			where: {
				id: volunteer.id,
			},
			data: {
				emailedAt: new Date(),
			},
		});
		return true;
	} catch (e) {
		// console.log(e);
		throw new Error(e);
	}
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

// async function test() {
// 	try {
// 		await sendEmail('75f2c683-190f-4ade-a809-459cfbdd7c16');
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// test();
