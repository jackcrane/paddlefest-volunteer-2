import { create } from '../create.js';
jest.mock('#util/prisma-client.js', () => {
	const originalClient = jest.requireActual('#util/prisma-client.js');
	return {
		...originalClient,
		volunteers: {
			create: jest.fn(),
		},
	};
});
import { client } from '#util/prisma-client.js';

describe('create a volunteer', () => {
	it('should create a new volunteer with valid data', async () => {
		const data = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			phone: '555-555-5555',
			referral: 'John Smith',
		};

		await create(data);

		expect(client.volunteers.create).toHaveBeenCalledWith({ data });
	});
});
