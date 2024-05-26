/*
  Warnings:

  - You are about to drop the column `videos` on the `Party` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Party" DROP COLUMN "videos";

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "partyId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
