/*
  Warnings:

  - Made the column `updatedAt` on table `Volunteers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Volunteers_email_key` ON `Volunteers`;

-- AlterTable
ALTER TABLE `Volunteers` MODIFY `updatedAt` DATETIME(3) NOT NULL;
