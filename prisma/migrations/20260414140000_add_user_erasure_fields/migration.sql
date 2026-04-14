-- F-032: GDPR Art. 17 erasure flow — User fields + SYSTEM_DELETED seed user

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "erasureRequestedAt" TIMESTAMP(3),
  ADD COLUMN "erasureScheduledAt" TIMESTAMP(3),
  ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_erasureScheduledAt_idx" ON "User"("erasureScheduledAt");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- Seed: SYSTEM_DELETED user pro zachování FK integrity při anonymizaci.
-- Pevné ID 'system-deleted-user'. Email .local TLD garantuje že nikdo nepřevezme.
INSERT INTO "User" (
  "id", "email", "passwordHash", "firstName", "lastName",
  "role", "status", "createdAt", "updatedAt"
) VALUES (
  'system-deleted-user',
  'deleted-user@carmakler.local',
  '',
  'Smazaný',
  'uživatel',
  'SYSTEM',
  'INACTIVE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
