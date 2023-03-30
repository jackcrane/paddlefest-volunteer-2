import express from 'express';
import { client } from '../../util/prisma-client.js';
import { generateEmail, sendEmail } from '../process-email.js';

const router = express.Router();

router.post('/', async (req, res) => {
	let { basicInfo, jobs, waiver } = req.body;
	try {
		// Verify that the jobs that the user selected are not full. If they are, return an error
		let jobs_full = await Promise.all(
			jobs.map(async (job) => {
				let shift = await client.shifts.findUnique({
					where: {
						id: job,
					},
				});
				return shift.volunteers?.length >= shift.maxVolunteers;
			})
		);
		if (jobs_full.some((x) => x === true)) {
			res.status(411).send('Shift not found. It may be full or an error has occured.');
			return;
		}

		let volunteer = await client.volunteers.create({
			data: {
				name: basicInfo.name,
				email: basicInfo.email,
				phone: basicInfo.phonenum,
				referral: basicInfo.heard_about,
				shirtSize: basicInfo.shirt_size.toUpperCase(),
			},
		});

		let vol_waiver = await client.waiver.create({
			data: {
				volunteer: {
					connect: {
						id: volunteer.id,
					},
				},
				signed: true,
				signedAt: new Date(),
				type: waiver.waiverType.toUpperCase(),
				emergencyContactName: waiver.emergencyName,
				emergencyContactPhone: waiver.emergencyPhone,
				emergencyContactEmail: waiver.emergencyEmail,
				minor__name: waiver.minorName,
				minor__parentName: waiver.parentName,
				minor__DOB: waiver.minorDob != '' ? new Date(waiver.minorDob) : null,
				minor__guardianEmail: waiver.parentEmail,
				adult__name: waiver.name,
			},
		});

		let vol_jobs = await Promise.all(
			jobs.map(async (job) => {
				let job_vol = await client.volunteersShifts.create({
					data: {
						shift: {
							connect: {
								id: job,
							},
						},
						volunteer: {
							connect: {
								id: volunteer.id,
							},
						},
					},
				});
				return job_vol;
			})
		);

		res.status(200).json({ volunteer, vol_waiver, vol_jobs });
		// res.redirect('/info/registration/' + volunteer.id);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
	try {
		sendEmail(volunteer.id);
	} catch (error) {
		// suppress
	}
});

export default router;
