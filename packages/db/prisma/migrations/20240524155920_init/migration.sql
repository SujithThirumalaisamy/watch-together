-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB');

-- CreateTable
CREATE TABLE "PartyClient" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "provider" "AuthProvider" NOT NULL,
    "password" TEXT,
    "partyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "PartyClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentVideo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartyClient_username_key" ON "PartyClient"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PartyClient_email_key" ON "PartyClient"("email");

-- AddForeignKey
ALTER TABLE "PartyClient" ADD CONSTRAINT "PartyClient_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
