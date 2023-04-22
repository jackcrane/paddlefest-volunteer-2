-- CreateTable
CREATE TABLE `Verifications` (
    `id` VARCHAR(191) NOT NULL,
    `volunteerId` VARCHAR(36) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Verifications_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Verifications` ADD CONSTRAINT `Verifications_volunteerId_fkey` FOREIGN KEY (`volunteerId`) REFERENCES `Volunteers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
