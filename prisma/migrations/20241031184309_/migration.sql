/*
  Warnings:

  - You are about to drop the column `commentOnPostId` on the `like_on_comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "like_on_comments" DROP CONSTRAINT "like_on_comments_commentOnPostId_fkey";

-- AlterTable
ALTER TABLE "like_on_comments" DROP COLUMN "commentOnPostId";
