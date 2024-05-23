/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `PartyClient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PartyClient_clientId_key" ON "PartyClient"("clientId");
