/*
  Warnings:

  - You are about to drop the column `date` on the `Shifts` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Shifts` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Shifts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shifts` DROP COLUMN `date`,
    DROP COLUMN `description`,
    ADD COLUMN `capacity` INTEGER NOT NULL;
