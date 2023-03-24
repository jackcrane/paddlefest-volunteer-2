/*
  Warnings:

  - You are about to drop the column `shirtSizeId` on the `Volunteers` table. All the data in the column will be lost.
  - You are about to drop the `ShirtSizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Volunteers` DROP FOREIGN KEY `Volunteers_shirtSizeId_fkey`;

-- AlterTable
ALTER TABLE `Volunteers` DROP COLUMN `shirtSizeId`,
    ADD COLUMN `shirtSize` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NULL;

-- DropTable
DROP TABLE `ShirtSizes`;

-- CreateTable
CREATE TABLE `Waiver` (
    `id` VARCHAR(191) NOT NULL,
    `volunteerId` VARCHAR(36) NOT NULL,
    `signed` BOOLEAN NOT NULL,
    `signedAt` DATETIME(3) NOT NULL,
    `type` ENUM('ADULT', 'MINOR') NOT NULL,
    `emergencyContactName` VARCHAR(191) NOT NULL,
    `emergencyContactPhone` VARCHAR(191) NOT NULL,
    `emergencyContactEmail` VARCHAR(191) NOT NULL,
    `minor__name` VARCHAR(191) NULL,
    `minor__parentName` VARCHAR(191) NULL,
    `minor__DOB` DATETIME(3) NULL,
    `minor__guardianEmail` VARCHAR(191) NULL,
    `adult__name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Waiver` ADD CONSTRAINT `Waiver_volunteerId_fkey` FOREIGN KEY (`volunteerId`) REFERENCES `Volunteers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
