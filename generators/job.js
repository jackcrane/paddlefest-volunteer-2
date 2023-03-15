import { client } from '#util/prisma-client.js';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

let spinner = createSpinner('Loading helper data').start();

const locations = await client.locations.findMany();
const restrictions = await client.restrictions.findMany();

spinner.success();

const { name, description } = await inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'What is the title of the job?',
	},
	{
		type: 'input',
		name: 'description',
		message: 'What is the description of the job?',
	},
]);

const location = await inquirer.prompt([
	{
		type: 'list',
		name: 'location',
		message: 'What is the location of the job?',
		choices: locations.map((location) => location.name),
	},
]);

let selected_restrictions = await inquirer.prompt([
	{
		type: 'checkbox',
		name: 'restrictions',
		message: 'What are the restrictions of the job?',
		choices: restrictions.map((restriction) => restriction.name),
	},
]);

const selected_location = locations.filter((_location) => _location.name === location.location)[0];

spinner = createSpinner('Creating job').start();

const job = await client.jobs.create({
	data: {
		name,
		description,
		location: {
			connect: {
				id: selected_location.id,
			},
		},
		restrictions: {
			connect: selected_restrictions.restrictions.map((restriction) => {
				return {
					name: restriction,
				};
			}),
		},
	},
});

spinner.success();
