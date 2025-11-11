# 🏠 Homepage - MongoDB Queries Documentation

## Overview

The homepage performs simple counting operations across all major collections to display real-time statistics.

---

## Query #1: Count Total Clubs

**Purpose**: Get total number of clubs in database

**MongoDB Query**:

```
db.clubs.countDocuments()
```

**Expected Output**: `50`

---

## Query #2: Count Total Players

**Purpose**: Get total number of players in database

**MongoDB Query**:

```
db.players.countDocuments()
```

**Expected Output**: `1250`

---

## Query #3: Count Total Matches

**Purpose**: Get total number of matches in database

**MongoDB Query**:

```
db.matches.countDocuments()
```

**Expected Output**: `380`

---

## Query #4: Count Total Transfers

**Purpose**: Get total number of transfers in database

**MongoDB Query**:

```
db.transfers.countDocuments()
```

**Expected Output**: `245`

---

## Query #5: Get Database Statistics

**Purpose**: Retrieve comprehensive database statistics

**MongoDB Query**:

```
db.runCommand({dbStats: 1})
```

---

## Query #6: Collection Statistics

**Purpose**: Get detailed statistics for each collection

**MongoDB Queries**:

```
db.clubs.stats()
db.players.stats()
db.matches.stats()
db.transfers.stats()
```

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
