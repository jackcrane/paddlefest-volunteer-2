import { client } from '#util/prisma-client.js';
import { LONGER_THAN_N, MATCHES_EMAIL, MATCHES_PHONE } from '#util/valid.js';

export async function create({ name, email, phone, referral }) {
	// Validate data
	const validity = [
		name && typeof name === 'string',
		email && typeof email === 'string',
		phone && typeof phone === 'string',
		referral && typeof referral === 'string',
		MATCHES_EMAIL(email),
		MATCHES_PHONE(phone),
		LONGER_THAN_N(2)(name),
		LONGER_THAN_N(2)(referral),
	].every(Boolean);

	if (!validity) {
		console.error('Invalid data', { name, email, phone, referral });
	} else {
		return await client.volunteers.create({ data: { name, email, phone, referral } });
	}
}
