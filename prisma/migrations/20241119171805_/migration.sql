/*
  Warnings:

  - You are about to drop the column `address_cep` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address_city` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address_number` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address_state` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address_street` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `events` table. All the data in the column will be lost.
  - Added the required column `address` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_type` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "address_cep",
DROP COLUMN "address_city",
DROP COLUMN "address_number",
DROP COLUMN "address_state",
DROP COLUMN "address_street",
DROP COLUMN "is_public",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "event_type" TEXT NOT NULL;
