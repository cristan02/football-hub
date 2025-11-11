# 🔍 Search & Analytics - MongoDB Queries Documentation

## Overview

Search functionality with 5 specific datasets consumed by the frontend: search results, position analytics, nationality stats, league stats, and top players.

---

## Query #1: Player/Club Search with Transfer Data

**Purpose**: Search players or clubs by name with transfer fee integration (consumed by frontend search results)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $match: {
      name: { $regex: searchQuery, $options: "i" }
    }
  },
  {
    $lookup: {
      from: "transfers",
      localField: "playerID",
      foreignField: "playerID",
      as: "transfers"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "clubID",
      as: "club"
    }
  },
  {
    $addFields: {
      latestTransferFee: {
        $cond: [
          { $gt: [{ $size: "$transfers" }, 0] },
          { $max: "$transfers.transferFee" },
          0
        ]
      }
    }
  },
  { $unwind: { path: "$club", preserveNullAndEmptyArrays: true } }
])
```

**Frontend Usage**: Search results cards showing players/clubs with transfer values

---

## Query #2: Position Distribution Analytics

**Purpose**: Analyze market values by position (consumed by frontend position analytics cards)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "transfers",
      localField: "playerID",
      foreignField: "playerID",
      as: "transfers"
    }
  },
  {
    $addFields: {
      latestTransferFee: {
        $cond: [
          { $gt: [{ $size: "$transfers" }, 0] },
          { $max: "$transfers.transferFee" },
          0
        ]
      }
    }
  },
  { $match: { latestTransferFee: { $gt: 0 } } },
  {
    $group: {
      _id: "$position",
      playerCount: { $sum: 1 },
      avgAge: { $avg: "$age" },
      avgMarketValue: { $avg: "$latestTransferFee" },
      playersWithTransfers: { $sum: 1 }
    }
  }
])
```

**Frontend Usage**: Position distribution cards with market values

---

## Query #3: Database Overview Statistics

**Purpose**: Get comprehensive database statistics for analytics panel

**MongoDB Query**:

```
db.runCommand({
  aggregate: "players",
  pipeline: [
    {
      $facet: {
        totalPlayers: [{ $count: "count" }],
        totalClubs: [
          { $lookup: { from: "clubs", pipeline: [], as: "clubs" } },
          { $unwind: "$clubs" },
          { $group: { _id: null, count: { $sum: 1 } } }
        ],
        totalMatches: [
          { $lookup: { from: "matches", pipeline: [], as: "matches" } },
          { $unwind: "$matches" },
          { $group: { _id: null, count: { $sum: 1 } } }
        ],
        totalTransfers: [
          { $lookup: { from: "transfers", pipeline: [], as: "transfers" } },
          { $unwind: "$transfers" },
          { $group: { _id: null, count: { $sum: 1 } } }
        ]
      }
    }
  ]
})
```

---
