/*
  Warnings:

  - You are about to alter the column `name` on the `ShirtSizes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(56)`.
  - Added the required column `slug` to the `ShirtSizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ShirtSizes` ADD COLUMN `slug` VARCHAR(8) NOT NULL,
    MODIFY `name` VARCHAR(56) NOT NULL;
