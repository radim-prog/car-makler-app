-- F-020: Marketplace waitlist gate
-- Uzavřená investiční platforma — veřejné stránky přesměrují na waitlist
-- dokud uživatel nemá validní invite token (env MARKETPLACE_INVITE_TOKENS).

CREATE TABLE "MarketplaceWaitlist" (
  "id"         TEXT NOT NULL,
  "email"      TEXT NOT NULL,
  "name"       TEXT,
  "phone"      TEXT,
  "role"       TEXT NOT NULL DEFAULT 'INVESTOR',
  "message"    TEXT,
  "source"     TEXT,
  "ipAddress"  TEXT,
  "userAgent"  TEXT,
  "invitedAt"  TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MarketplaceWaitlist_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MarketplaceWaitlist_email_key"       ON "MarketplaceWaitlist"("email");
CREATE INDEX        "MarketplaceWaitlist_role_idx"         ON "MarketplaceWaitlist"("role", "createdAt");
CREATE INDEX        "MarketplaceWaitlist_createdAt_idx"    ON "MarketplaceWaitlist"("createdAt");

-- carmakler app user potřebuje zápis (FIX-033 best practice)
GRANT INSERT, SELECT, UPDATE ON TABLE "MarketplaceWaitlist" TO carmakler;
