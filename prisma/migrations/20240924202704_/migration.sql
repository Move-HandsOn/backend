-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,
    "gender" TEXT,
    "interests" TEXT,
    "followers" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
