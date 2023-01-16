-- DropForeignKey
ALTER TABLE `Restrictions` DROP FOREIGN KEY `Restrictions_shiftId_fkey`;

-- AlterTable
ALTER TABLE `Restrictions` MODIFY `shiftId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Restrictions` ADD CONSTRAINT `Restrictions_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shifts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
