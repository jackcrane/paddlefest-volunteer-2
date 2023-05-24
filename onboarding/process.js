import inquirer from 'inquirer';
import ora from 'ora';
import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

const createNewShift = async (jobId, lastCapacity) => {
	const shift = await inquirer.prompt([
		{
			type: 'input',
			name: 'startTime',
			message: 'Shift start time:',
			filter: (val) => moment(val, 'M/D/YY h:mm A').tz('EST').toISOString(),
		},
		{
			type: 'input',
			name: 'endTime',
			message: 'Shift end time:',
			filter: (val) => moment(val, 'M/D/YY h:mm A').tz('EST').toISOString(),
		},
		{
			type: 'input',
			name: 'capacity',
			message: 'Shift max capacity:',
			default: lastCapacity,
		},
	]);

	await prisma.shifts.create({
		data: {
			startTime: shift.startTime,
			endTime: shift.endTime,
			capacity: parseInt(shift.capacity),
			jobId: jobId,
		},
	});

	return shift.capacity;
};

const createNewJob = async () => {
	const locations = await prisma.locations.findMany();
	const restrictions = await prisma.restrictions.findMany();

	const job = await inquirer.prompt([
		{
			type: 'list',
			name: 'location',
			message: 'Where would you like to create this job?',
			choices: locations.map((location) => ({ name: location.name, value: location.id })),
		},
		{
			type: 'input',
			name: 'title',
			message: 'What is this job title?',
		},
		{
			type: 'input',
			name: 'description',
			message: 'What is this job description?',
		},
		{
			type: 'checkbox',
			name: 'restrictions',
			message: 'Any restrictions?',
			choices: restrictions
				.map((restriction) => ({ name: restriction.name, value: restriction.id }))
				.concat({ name: 'None', value: null }),
		},
	]);

	const jobRecord = await prisma.jobs.create({
		data: {
			name: job.title,
			description: job.description,
			locationId: job.location,
			restrictions: {
				connect: job.restrictions.filter((r) => r !== null).map((r) => ({ id: r })),
			},
		},
	});

	let lastCapacity = null;
	let next = 'new shift';

	while (next === 'new shift') {
		lastCapacity = await createNewShift(jobRecord.id, lastCapacity);
		const { nextAction } = await inquirer.prompt({
			type: 'list',
			name: 'nextAction',
			message: 'What to do next?',
			choices: ['new shift', 'new job', 'quit'],
		});
		next = nextAction;
	}

	return next;
};

const runApp = async () => {
	const spinner = ora('Running Job and Shift Creation Tool...').start();
	spinner.stop();
	try {
		let next = 'new job';
		while (next !== 'quit') {
			if (next === 'new job') {
				next = await createNewJob();
			}
		}
		spinner.succeed('Job and Shift Creation Tool exited successfully.');
	} catch (err) {
		spinner.fail(`An error occurred: ${err.message}`);
	} finally {
		await prisma.$disconnect();
	}
};

runApp();
