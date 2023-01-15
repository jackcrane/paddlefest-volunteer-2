/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Volunteers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Volunteers_email_key` ON `Volunteers`(`email`);
