-- AlterTable
ALTER TABLE `Verifications` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `AccessTokens` (
    `id` VARCHAR(191) NOT NULL,
    `volunteerId` VARCHAR(36) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessTokens` ADD CONSTRAINT `AccessTokens_volunteerId_fkey` FOREIGN KEY (`volunteerId`) REFERENCES `Volunteers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
