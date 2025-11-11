# 🌱 Novel Nest Database Seeding - Quick Start

## 30-Second Setup

```bash
# 1. Install packages
npm install

# 2. Verify .env has DATABASE_URL pointing to your MySQL
# DATABASE_URL="mysql://root:your_password@localhost:3306/novel_nest"

# 3. Run seed
npm run seed

# 4. Start dev server
npm run dev

# 5. Visit http://localhost:3000
```

## Test Logins

```
Author Login:
Email: jausten@example.com
Password: pass4jane

Reader Login:
Email: reader22@example.com
Password: password123
```

## What Gets Seeded

✅ 7 users (5 authors + 2 readers)  
✅ 5 novels (Pride & Prejudice, Dune, The Hobbit, Mockingbird, 1984)  
✅ 10 episodes/chapters  
✅ 10 reviews  
✅ 10 comments  
✅ Follow relationships  
✅ Wishlists  
✅ Reading progress/bookmarks  

## Files Created

- `scripts/seed_novels.sql` — SQL data file
- `scripts/seed.js` — Seeding script
- `scripts/SEEDING_GUIDE.md` — Full guide
- `scripts/SEED_IMPLEMENTATION_SUMMARY.md` — Detailed summary

## Troubleshooting

**Error: DATABASE_URL not found**
→ Update `.env` file in `/code` folder

**Error: Can't connect to MySQL**
→ Make sure MySQL is running and credentials are correct

**Error: Database doesn't exist**
→ Create it: `mysql -u root -p -e "CREATE DATABASE novel_nest;"`

**Safe to run multiple times**
→ Yes! Script uses `ON DUPLICATE KEY UPDATE`

---

For full documentation, see `SEEDING_GUIDE.md`
