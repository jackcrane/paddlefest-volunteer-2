/*
  Warnings:

  - You are about to drop the column `shiftId` on the `Restrictions` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Shifts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Restrictions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Restrictions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Restrictions` DROP FOREIGN KEY `Restrictions_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `Shifts` DROP FOREIGN KEY `Shifts_locationId_fkey`;

-- AlterTable
ALTER TABLE `Locations` ADD COLUMN `slug` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Restrictions` DROP COLUMN `shiftId`,
    ADD COLUMN `jobId` VARCHAR(36) NULL,
    ADD COLUMN `slug` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Shifts` DROP COLUMN `locationId`,
    ADD COLUMN `jobId` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `Jobs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `locationId` VARCHAR(36) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Locations_slug_key` ON `Locations`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Restrictions_slug_key` ON `Restrictions`(`slug`);

-- AddForeignKey
ALTER TABLE `Jobs` ADD CONSTRAINT `Jobs_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shifts` ADD CONSTRAINT `Shifts_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Restrictions` ADD CONSTRAINT `Restrictions_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
