/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ShirtSizes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ShirtSizes_slug_key` ON `ShirtSizes`(`slug`);
