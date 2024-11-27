-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "event_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "followerFollower_id" TEXT,
    "followerFollowed_id" TEXT,
    "comment_id" TEXT,
    "like_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followerFollower_id_followerFollowed_id_fkey" FOREIGN KEY ("followerFollower_id", "followerFollowed_id") REFERENCES "followers"("follower_id", "followed_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_like_id_fkey" FOREIGN KEY ("like_id") REFERENCES "likes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
