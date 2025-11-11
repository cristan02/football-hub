# 🏠 Homepage - MongoDB Queries Documentation

## Overview

The homepage is a **static page** with no database queries. It displays navigation cards and technology stack information without making any API calls.

---

## Query Status

**❌ No Database Queries Used**

The homepage (`app/page.tsx`) is a static Next.js page that renders:

- Navigation cards to other features
- Technology stack information
- Static hero content

---

## MongoDB Shell Usage

**Connect and run queries**:

```
# Connect to database
mongosh "mongodb+srv://your-connection-string/footballhub"

# Execute homepage queries
db.clubs.countDocuments()
db.players.countDocuments()
db.matches.countDocuments()
db.transfers.countDocuments()
```

---
