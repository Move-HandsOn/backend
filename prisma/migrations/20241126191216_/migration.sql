/*
  Warnings:

  - You are about to drop the column `status` on the `group_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group_members" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "group_requests" ALTER COLUMN "status" SET DEFAULT 'none';
