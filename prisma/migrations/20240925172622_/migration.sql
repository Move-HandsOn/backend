/*
  Warnings:

  - The primary key for the `activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feeds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `group_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `groupsOnEvents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_group_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "groupsOnEvents" DROP CONSTRAINT "groupsOnEvents_event_id_fkey";

-- DropForeignKey
ALTER TABLE "groupsOnEvents" DROP CONSTRAINT "groupsOnEvents_group_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- AlterTable
ALTER TABLE "activities" DROP CONSTRAINT "activities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "activities_id_seq";

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "activity_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "events" DROP CONSTRAINT "events_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "group_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "events_id_seq";

-- AlterTable
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "activity_id" SET DATA TYPE TEXT,
ALTER COLUMN "group_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "feeds_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "feeds_id_seq";

-- AlterTable
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_pkey",
ALTER COLUMN "group_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "user_id");

-- AlterTable
ALTER TABLE "groups" DROP CONSTRAINT "groups_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "groups_id_seq";

-- AlterTable
ALTER TABLE "groupsOnEvents" DROP CONSTRAINT "groupsOnEvents_pkey",
ALTER COLUMN "group_id" SET DATA TYPE TEXT,
ALTER COLUMN "event_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "groupsOnEvents_pkey" PRIMARY KEY ("group_id", "event_id");

-- DropTable
DROP TABLE "likes";

-- CreateTable
CREATE TABLE "likesOnComments" (
    "user_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "likesOnComments_pkey" PRIMARY KEY ("user_id","comment_id")
);

-- CreateTable
CREATE TABLE "likesOnActivities" (
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,

    CONSTRAINT "likesOnActivities_pkey" PRIMARY KEY ("user_id","activity_id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likesOnComments" ADD CONSTRAINT "likesOnComments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likesOnComments" ADD CONSTRAINT "likesOnComments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likesOnActivities" ADD CONSTRAINT "likesOnActivities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likesOnActivities" ADD CONSTRAINT "likesOnActivities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupsOnEvents" ADD CONSTRAINT "groupsOnEvents_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupsOnEvents" ADD CONSTRAINT "groupsOnEvents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
