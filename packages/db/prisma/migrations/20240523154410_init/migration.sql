-- CreateTable
CREATE TABLE "PartyClient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,

    CONSTRAINT "PartyClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentVideo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartyClient" ADD CONSTRAINT "PartyClient_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
