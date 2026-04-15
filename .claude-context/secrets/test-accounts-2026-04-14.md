# Test Audit Accounts — 2026-04-14
**Sandbox:** https://car.zajcon.cz
**Heslo:** TestAudit2026!
**Status:** Aktivní — smazat po dokončení auditu

| Email | Role | Status |
|-------|------|--------|
| audit+admin-2026-04-14@carmakler.cz | ADMIN | ACTIVE |
| audit+broker-2026-04-14@carmakler.cz | BROKER | ONBOARDING |
| audit+buyer-2026-04-14@carmakler.cz | BUYER | ACTIVE |
| audit+advertiser-2026-04-14@carmakler.cz | ADVERTISER | ACTIVE |
| audit+investor-2026-04-14@carmakler.cz | INVESTOR | ACTIVE |

## Smazání po auditu
```sql
DELETE FROM "User" WHERE email LIKE 'audit+%';
```
