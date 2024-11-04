-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_category_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_media" DROP CONSTRAINT "activity_media_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "comments_on_activities" DROP CONSTRAINT "comments_on_activities_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "comments_on_activities" DROP CONSTRAINT "comments_on_activities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments_on_posts" DROP CONSTRAINT "comments_on_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comments_on_posts" DROP CONSTRAINT "comments_on_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events_on_groups" DROP CONSTRAINT "events_on_groups_event_id_fkey";

-- DropForeignKey
ALTER TABLE "events_on_groups" DROP CONSTRAINT "events_on_groups_group_id_fkey";

-- DropForeignKey
ALTER TABLE "like_on_activities" DROP CONSTRAINT "like_on_activities_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "like_on_activities" DROP CONSTRAINT "like_on_activities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "like_on_comments" DROP CONSTRAINT "like_on_comments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "like_on_comments" DROP CONSTRAINT "like_on_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_posts" DROP CONSTRAINT "likes_on_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_posts" DROP CONSTRAINT "likes_on_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_posts_comments" DROP CONSTRAINT "likes_on_posts_comments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_posts_comments" DROP CONSTRAINT "likes_on_posts_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "posts_on_groups" DROP CONSTRAINT "posts_on_groups_group_id_fkey";

-- DropForeignKey
ALTER TABLE "posts_on_groups" DROP CONSTRAINT "posts_on_groups_post_id_fkey";

-- AlterTable
ALTER TABLE "user_interests" DROP CONSTRAINT "user_interests_pkey",
DROP COLUMN "insterest_name",
DROP COLUMN "interest_id",
DROP COLUMN "interest_type",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_interests_pkey" PRIMARY KEY ("user_id", "category_id");

-- DropTable
DROP TABLE "activities_categories";

-- DropTable
DROP TABLE "activity_media";

-- DropTable
DROP TABLE "comments_on_activities";

-- DropTable
DROP TABLE "comments_on_posts";

-- DropTable
DROP TABLE "events_on_groups";

-- DropTable
DROP TABLE "like_on_activities";

-- DropTable
DROP TABLE "like_on_comments";

-- DropTable
DROP TABLE "likes_on_posts";

-- DropTable
DROP TABLE "likes_on_posts_comments";

-- DropTable
DROP TABLE "posts_on_groups";

-- CreateTable
CREATE TABLE "medias_url" (
    "id" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "activity_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "medias_url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "comment_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT,
    "post_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "activity_id" TEXT,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias_url" ADD CONSTRAINT "medias_url_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias_url" ADD CONSTRAINT "medias_url_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
