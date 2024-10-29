/*
  Warnings:

  - You are about to drop the `likesOnActivities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likesOnComments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_type` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likesOnActivities" DROP CONSTRAINT "likesOnActivities_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "likesOnActivities" DROP CONSTRAINT "likesOnActivities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likesOnComments" DROP CONSTRAINT "likesOnComments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "likesOnComments" DROP CONSTRAINT "likesOnComments_user_id_fkey";

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "post_type" TEXT NOT NULL;

-- DropTable
DROP TABLE "likesOnActivities";

-- DropTable
DROP TABLE "likesOnComments";

-- CreateTable
CREATE TABLE "activity_media" (
    "id" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,

    CONSTRAINT "activity_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities_categories" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "activities_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like_on_comments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "like_on_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like_on_activities" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "like_on_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_filters" (
    "id" TEXT NOT NULL,
    "filterName" TEXT NOT NULL,
    "filterType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "search_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_requests" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "group_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activities_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_media" ADD CONSTRAINT "activity_media_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_comments" ADD CONSTRAINT "like_on_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_comments" ADD CONSTRAINT "like_on_comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_activities" ADD CONSTRAINT "like_on_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_on_activities" ADD CONSTRAINT "like_on_activities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_filters" ADD CONSTRAINT "search_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_requests" ADD CONSTRAINT "group_requests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_requests" ADD CONSTRAINT "group_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
