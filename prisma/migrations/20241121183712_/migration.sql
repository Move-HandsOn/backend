-- CreateTable
CREATE TABLE "Calendar" (
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("event_id","user_id")
);

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
