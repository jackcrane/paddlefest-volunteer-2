-- DropForeignKey
ALTER TABLE `Shifts` DROP FOREIGN KEY `Shifts_locationId_fkey`;

-- AlterTable
ALTER TABLE `Shifts` MODIFY `locationId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Shifts` ADD CONSTRAINT `Shifts_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
