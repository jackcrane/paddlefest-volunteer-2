import { client } from '#util/prisma-client.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import moment from 'moment';
import { createSpinner } from 'nanospinner';

let spinner = createSpinner('Loading helper data').start();

const jobs = await client.jobs.findMany();

spinner.success();

const { job, capacity } = await inquirer.prompt([
	{
		type: 'list',
		name: 'job',
		message: 'Which job are you creating a shift for?',
		choices: jobs.map((job) => job.name + ' (' + chalk.gray(job.description) + ')'),
	},
	{
		type: 'number',
		name: 'capacity',
		message: 'What is the max number of volunteers on this shift?',
	},
]);

const selected_job = jobs.filter((_job) => _job.name === job.split(' (')[0])[0];

let startProcessedCorrectly = false;

let startTime;
while (!startProcessedCorrectly) {
	const { start } = await inquirer.prompt([
		{
			type: 'text',
			name: 'start',
			message: `When does the shift start ${chalk.gray('__:__ am|pm __/__')}?`,
		},
	]);
	const parsedTime = moment(start, 'h:mm a MM/DD');
	const { correct } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'correct',
			message: `Is ${chalk.gray(parsedTime.format('[TIME] h:mm a [ON DATE] MMMM DD'))} correct?`,
		},
	]);
	if (correct) {
		startProcessedCorrectly = true;
	}
	startTime = parsedTime;
}

let endProcessedCorrectly = false;

let endTime;
while (!endProcessedCorrectly) {
	const { end } = await inquirer.prompt([
		{
			type: 'text',
			name: 'end',
			message: `When does the shift end ${chalk.gray('__:__ am|pm __/__')}?`,
		},
	]);
	const parsedTime = moment(end, 'h:mm a MM/DD');
	const { correct } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'correct',
			message: `Is ${chalk.gray(parsedTime.format('[TIME] h:mm a [ON DATE] MMMM DD'))} correct?`,
		},
	]);
	if (correct) {
		endProcessedCorrectly = true;
	}
	endTime = parsedTime;
}

if (!(startTime && endTime)) {
	process.exit(1);
}

spinner = createSpinner('Creating shift').start();

const shift = await client.shifts.create({
	data: {
		startTime: startTime.toDate(),
		endTime: endTime.toDate(),
		capacity,
		job: {
			connect: {
				id: selected_job.id,
			},
		},
	},
});

spinner.success();
