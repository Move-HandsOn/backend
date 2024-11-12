-- AlterTable
ALTER TABLE "medias_url" ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "post_id" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/default.jpg?t=2024-11-12T15%3A25%3A15.634Z';

-- AddForeignKey
ALTER TABLE "medias_url" ADD CONSTRAINT "medias_url_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias_url" ADD CONSTRAINT "medias_url_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
