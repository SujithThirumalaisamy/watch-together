/*
  Warnings:

  - You are about to drop the column `clientId` on the `PartyClient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `PartyClient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `PartyClient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `PartyClient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `PartyClient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB');

-- DropIndex
DROP INDEX "PartyClient_clientId_key";

-- AlterTable
ALTER TABLE "PartyClient" DROP COLUMN "clientId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "provider" "AuthProvider" NOT NULL,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PartyClient_username_key" ON "PartyClient"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PartyClient_email_key" ON "PartyClient"("email");
