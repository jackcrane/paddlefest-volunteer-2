import { appendFileSync } from 'fs';

const log_level = process.env.LOG_LEVEL || 'log';
const write = log_level === 'write';

function log(...args) {
	const message = args
		.map((arg) => {
			if (typeof arg === 'object' || typeof arg === 'function') {
				return JSON.stringify(arg);
			}
			return arg;
		})
		.join(' ');

	write && appendFileSync('./log.txt', `${new Date().toISOString()} - ${message}\n`);
	console.log(message);
}

function error(...args) {
	const message = args
		.map((arg) => {
			if (typeof arg === 'object' || typeof arg === 'function') {
				return JSON.stringify(arg);
			}
			return arg;
		})
		.join(' ');
	write && appendFileSync('./error.txt', `${new Date().toISOString()} - ${message}\n`);
	console.error(message);
}

const _console = {
	log,
	error,
};

export { _console as console };
