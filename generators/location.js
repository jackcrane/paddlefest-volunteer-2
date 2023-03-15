import { client } from '#util/prisma-client.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

const { name, address, slug } = await inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'What is the name of the location?',
	},
	{
		type: 'input',
		name: 'address',
		message: 'What is the address of the location?',
	},
	{
		type: 'input',
		name: 'slug',
		message: 'What is the slug of the location? (should be one word, UpperCamelCase if necessary)',
	},
]);

let spinner = createSpinner('Creating location').start();

const location = await client.locations.create({
	data: {
		name,
		address,
		slug,
	},
});

spinner.success();

spinner = createSpinner('Loading all locations').start();

const locations = await client.locations.findMany();

spinner.success();

locations.forEach((location) => {
	process.stdout.write(chalk.inverse(`  ${location.name}  `) + ' ');
});

console.log();
