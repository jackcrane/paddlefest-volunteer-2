/*
  Warnings:

  - A unique constraint covering the columns `[jobId,startTime]` on the table `Shifts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Shifts_jobId_startTime_key` ON `Shifts`(`jobId`, `startTime`);
