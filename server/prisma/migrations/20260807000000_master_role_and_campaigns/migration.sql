-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MASTER';

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "masterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_members" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_masterId_idx" ON "campaigns"("masterId");

-- CreateIndex
CREATE INDEX "campaign_members_userId_idx" ON "campaign_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_members_campaignId_userId_key" ON "campaign_members"("campaignId", "userId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
