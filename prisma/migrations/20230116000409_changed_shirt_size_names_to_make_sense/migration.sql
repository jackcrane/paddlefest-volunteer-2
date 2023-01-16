/*
  Warnings:

  - You are about to drop the column `shirtSize` on the `Volunteers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Volunteers` DROP FOREIGN KEY `Volunteers_shirtSize_fkey`;

-- AlterTable
ALTER TABLE `Volunteers` DROP COLUMN `shirtSize`,
    ADD COLUMN `shirtSizeId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Volunteers` ADD CONSTRAINT `Volunteers_shirtSizeId_fkey` FOREIGN KEY (`shirtSizeId`) REFERENCES `ShirtSizes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
