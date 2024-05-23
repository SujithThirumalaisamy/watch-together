-- DropForeignKey
ALTER TABLE "PartyClient" DROP CONSTRAINT "PartyClient_partyId_fkey";

-- AlterTable
ALTER TABLE "PartyClient" ALTER COLUMN "partyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PartyClient" ADD CONSTRAINT "PartyClient_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
