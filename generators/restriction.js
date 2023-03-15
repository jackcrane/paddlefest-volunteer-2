import { client } from '#util/prisma-client.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

const { name, address, slug } = await inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'What is the name of the restriction?',
	},
	{
		type: 'input',
		name: 'slug',
		message:
			'What is the slug of the restriction? (should be one word, UpperCamelCase if necessary)',
	},
]);

let spinner = createSpinner('Creating restriction').start();

const restriction = await client.restrictions.create({
	data: {
		name,
		slug,
	},
});

spinner.success();

spinner = createSpinner('Loading all restrictions').start();

const restrictions = await client.restrictions.findMany();

spinner.success();

restrictions.forEach((restriction) => {
	process.stdout.write(chalk.inverse(`  ${restriction.name}  `) + ' ');
});

console.log();
