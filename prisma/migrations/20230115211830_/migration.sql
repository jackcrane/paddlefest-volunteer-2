-- DropForeignKey
ALTER TABLE `Volunteers` DROP FOREIGN KEY `Volunteers_shirtSize_fkey`;

-- AlterTable
ALTER TABLE `Volunteers` MODIFY `shirtSize` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Volunteers` ADD CONSTRAINT `Volunteers_shirtSize_fkey` FOREIGN KEY (`shirtSize`) REFERENCES `ShirtSizes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
