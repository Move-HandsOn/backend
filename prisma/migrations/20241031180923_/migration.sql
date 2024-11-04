/*
  Warnings:

  - You are about to drop the column `activityId` on the `like_on_activities` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `like_on_activities` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `like_on_comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `like_on_comments` table. All the data in the column will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feeds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groupsOnEvents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activity_id` to the `like_on_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `like_on_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment_id` to the `like_on_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `like_on_comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_group_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_user_id_fkey";

-- DropForeignKey
ALTER TABLE "groupsOnEvents" DROP CONSTRAINT "groupsOnEvents_event_id_fkey";

-- DropForeignKey
ALTER TABLE "groupsOnEvents" DROP CONSTRAINT "groupsOnEvents_group_id_fkey";

-- DropForeignKey
ALTER TABLE "like_on_activities" DROP CONSTRAINT "like_on_activities_activityId_fkey";

-- DropForeignKey
ALTER TABLE "like_on_activities" DROP CONSTRAINT "like_on_activities_userId_fkey";

-- DropForeignKey
ALTER TABLE "like_on_comments" DROP CONSTRAINT "like_on_comments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "like_on_comments" DROP CONSTRAINT "like_on_comments_userId_fkey";

-- AlterTable
ALTER TABLE "like_on_activities" DROP COLUMN "activityId",
DROP COLUMN "userId",
ADD COLUMN     "activity_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "like_on_comments" DROP COLUMN "commentId",
DROP COLUMN "userId",
ADD COLUMN     "commentOnPostId" TEXT,
ADD COLUMN     "comment_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "feeds";

-- DropTable
DROP TABLE "groupsOnEvents";

-- CreateTable
CREATE TABLE "comments_on_activities" (
    "id" TEXT NOT NULL,
    "comment_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_on_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_on_groups" (
    "group_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "events_on_groups_pkey" PRIMARY KEY ("group_id","event_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "post_content" TEXT NOT NULL,
    "post_type" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts_on_groups" (
    "group_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "posts_on_groups_pkey" PRIMARY KEY ("group_id","post_id")
);

-- CreateTable
CREATE TABLE "comments_on_posts" (
    "id" TEXT NOT NULL,
    "comment_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_on_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes_on_posts" (
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "likes_on_posts_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "likes_on_posts_comments" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "likes_on_posts_comments_pkey" PRIMARY KEY ("comment_id","user_id")
);

-- AddForeignKey
ALTER TABLE "comments_on_activities" ADD CONSTRAINT "comments_on_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_on_activities" ADD CONSTRAINT "comments_on_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_comments" ADD CONSTRAINT "like_on_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_comments" ADD CONSTRAINT "like_on_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments_on_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_comments" ADD CONSTRAINT "like_on_comments_commentOnPostId_fkey" FOREIGN KEY ("commentOnPostId") REFERENCES "comments_on_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_activities" ADD CONSTRAINT "like_on_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_activities" ADD CONSTRAINT "like_on_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_on_groups" ADD CONSTRAINT "events_on_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_on_groups" ADD CONSTRAINT "events_on_groups_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_on_groups" ADD CONSTRAINT "posts_on_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_on_groups" ADD CONSTRAINT "posts_on_groups_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_on_posts" ADD CONSTRAINT "comments_on_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_on_posts" ADD CONSTRAINT "comments_on_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_posts" ADD CONSTRAINT "likes_on_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_posts" ADD CONSTRAINT "likes_on_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_posts_comments" ADD CONSTRAINT "likes_on_posts_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_posts_comments" ADD CONSTRAINT "likes_on_posts_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments_on_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
