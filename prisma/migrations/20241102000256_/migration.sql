/*
  Warnings:

  - Added the required column `group_type` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "group_type" TEXT NOT NULL;
