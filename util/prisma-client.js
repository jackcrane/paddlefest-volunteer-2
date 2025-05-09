import { PrismaClient } from '.prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const client = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL,
		},
	},
});

export { client };
