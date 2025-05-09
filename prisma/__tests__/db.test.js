import { PrismaClient } from '.prisma/client';
import { RESTRICTION, SHIFT, SHIRT_SIZE, VOLUNTEER } from '../../test-utils/constants';
import { validate } from 'uuid';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL,
		},
	},
});
afterAll(async () => {
	return prisma.$disconnect();
});

beforeEach(async () => {
	await prisma.volunteers.deleteMany();
	await prisma.shirtSizes.deleteMany();
	await prisma.shifts.deleteMany();
});
afterEach(async () => {
	await prisma.volunteers.deleteMany();
	await prisma.shirtSizes.deleteMany();
	await prisma.shifts.deleteMany();
});

describe('Creating user records in the database', () => {
	it('Creates new user correctly', async () => {
		const volunteer = VOLUNTEER();

		await prisma.volunteers.create({
			data: volunteer,
		});

		const [savedUser] = await prisma.volunteers.findMany({
			where: { email: volunteer.email },
			take: 1,
		});

		expect(savedUser.email).toBe(volunteer.email);
	});

	it('Fails to create user with duplicate email', async () => {
		const volunteer = VOLUNTEER();

		await prisma.volunteers.create({
			data: volunteer,
		});

		await expect(
			prisma.volunteers.create({
				data: volunteer,
			})
		).rejects.toThrowError();
	});

	const volunteer = VOLUNTEER();
	const requiredFields = ['name', 'email', 'phone', 'referral'];

	for (const field of requiredFields) {
		it(`Requires [${field}] to be present`, async () => {
			const data = {
				...volunteer,
				[field]: null,
			};
			await expect(
				prisma.volunteers.create({
					data,
				})
			).rejects.toThrowError();
		});
	}

	it('Generates a UUID for the volunteer', async () => {
		const volunteer = VOLUNTEER();

		const { id } = await prisma.volunteers.create({
			data: volunteer,
		});

		expect(validate(id)).toBe(true);
	});

	it('Associates a shirt size to a volunteer', async () => {
		const volunteer = VOLUNTEER();
		const shirtSize = SHIRT_SIZE();

		await prisma.shirtSizes.create({
			data: shirtSize,
		});

		const { id } = await prisma.volunteers.create({
			data: volunteer,
		});

		await prisma.volunteers.update({
			where: { id },
			data: {
				shirtSize: {
					connect: {
						slug: shirtSize.slug,
					},
				},
			},
		});

		const [savedVolunteer] = await prisma.volunteers.findMany({
			where: { id },
			take: 1,
			include: {
				shirtSize: true,
			},
		});

		expect(savedVolunteer.shirtSize.slug).toBe(shirtSize.slug);
	});
});

describe('Creating shift records in the database', () => {
	it('Creates a new shift correctly', async () => {
		const shift = SHIFT();

		await prisma.shifts.create({
			data: shift,
		});

		const [savedShift] = await prisma.shifts.findMany({
			where: { name: shift.name },
			take: 1,
		});

		expect(savedShift.name).toBe(shift.name);
	});

	const requiredFields = ['name', 'startTime', 'endTime', 'date', 'description'];
	for (const field of requiredFields) {
		it(`Requires [${field}] to be present`, async () => {
			const shift = SHIFT();
			const data = {
				...shift,
				[field]: null,
			};

			await expect(
				prisma.shifts.create({
					data,
				})
			).rejects.toThrowError();
		});
	}

	it('Generates a UUID for the shift', async () => {
		const shift = SHIFT();

		const { id } = await prisma.shifts.create({
			data: shift,
		});

		expect(validate(id)).toBe(true);
	});
});

describe('Creating restrictions records in the database', () => {
	it('Creates a new restriction correctly', async () => {
		const restriction = RESTRICTION();

		await prisma.restrictions.create({
			data: restriction,
		});

		const [savedRestriction] = await prisma.restrictions.findMany({
			where: { name: restriction.name },
			take: 1,
		});

		expect(savedRestriction.name).toBe(restriction.name);
	});

	it('Requires [name] to be present', async () => {
		const restriction = RESTRICTION();
		const data = {
			...restriction,
			name: null,
		};

		await expect(
			prisma.restrictions.create({
				data,
			})
		).rejects.toThrowError();
	});

	it('Generates a UUID for the restriction', async () => {
		const restriction = RESTRICTION();

		const { id } = await prisma.restrictions.create({
			data: restriction,
		});

		expect(validate(id)).toBe(true);
	});

	it('Associates a restriction to a shift', async () => {
		const shift = SHIFT();
		const restriction = RESTRICTION();

		// Shifts have a 'restrictions' field that should reperesent an array of restrictions

		await prisma.restrictions.create({
			data: restriction,
		});

		// Get the restriction from db
		const [restrictionFromDb] = await prisma.restrictions.findMany({
			where: { name: restriction.name },
			take: 1,
		});
		const restrictionId = restrictionFromDb.id;

		const { id } = await prisma.shifts.create({
			data: shift,
		});

		await prisma.shifts.update({
			where: { id },
			data: {
				restrictions: {
					connect: {
						id: restrictionId,
					},
				},
			},
		});

		const [savedShift] = await prisma.shifts.findMany({
			where: { id },
			take: 1,
			include: {
				restrictions: true,
			},
		});

		expect(savedShift.restrictions[0].id).toBe(restrictionId);
	});
});
