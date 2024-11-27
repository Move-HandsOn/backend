/*
  Warnings:

  - Added the required column `updated_at` to the `group_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_members" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
