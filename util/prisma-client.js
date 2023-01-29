import { PrismaClient } from '@prisma/client';

const client = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL,
		},
	},
});

export { client };
