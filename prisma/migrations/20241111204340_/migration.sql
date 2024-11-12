/*
  Warnings:

  - You are about to drop the column `groupId` on the `group_requests` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `group_requests` table. All the data in the column will be lost.
  - You are about to drop the column `filterName` on the `search_filters` table. All the data in the column will be lost.
  - You are about to drop the column `filterType` on the `search_filters` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `search_filters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,comment_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,activity_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_id` to the `group_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `group_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filter_name` to the `search_filters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filter_type` to the `search_filters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `search_filters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group_requests" DROP CONSTRAINT "group_requests_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_requests" DROP CONSTRAINT "group_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "search_filters" DROP CONSTRAINT "search_filters_userId_fkey";

-- AlterTable
ALTER TABLE "group_requests" DROP COLUMN "groupId",
DROP COLUMN "userId",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "admin_id" TEXT;

-- AlterTable
ALTER TABLE "search_filters" DROP COLUMN "filterName",
DROP COLUMN "filterType",
DROP COLUMN "userId",
ADD COLUMN     "filter_name" TEXT NOT NULL,
ADD COLUMN     "filter_type" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_comment_id_key" ON "likes"("user_id", "comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_activity_id_key" ON "likes"("user_id", "activity_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_requests" ADD CONSTRAINT "group_requests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_requests" ADD CONSTRAINT "group_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_filters" ADD CONSTRAINT "search_filters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
