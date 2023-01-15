import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { VOLUNTEER } from "../../test-utils/constants";

const prisma = new PrismaClient();
afterAll(async () => {
  return prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.volunteers.deleteMany();
});

describe("Creating user records in the database", () => {
  it("creates new user correctly", async () => {
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

  it("fails to create user with duplicate email", async () => {
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
});
