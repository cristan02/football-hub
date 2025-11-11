# 🔄 Transfer Market - MongoDB Queries Documentation

## Overview

Transfer market analysis with 3 specific datasets consumed by the frontend: transfers list, transfer analytics by position, and expensive transfers.

---

## Query #1: Transfers with Full Player and Club Details

**Purpose**: Get all transfers with player and club information (consumed by frontend transfers table)

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "playerID",
      as: "player"
    }
  },
  { $unwind: "$player" },
  {
    $lookup: {
      from: "clubs",
      localField: "fromClubID",
      foreignField: "clubID",
      as: "fromClub"
    }
  },
  { $unwind: "$fromClub" },
  {
    $lookup: {
      from: "clubs",
      localField: "toClubID",
      foreignField: "clubID",
      as: "toClub"
    }
  },
  { $unwind: "$toClub" },
  { $sort: { date: -1 } }
])
```

**Frontend Usage**: Transfer history table with player names, clubs, and transfer details

---

## Query #2: Transfer Analytics by Position

**Purpose**: Analyze transfer market by player position (consumed by frontend position analytics cards)

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "playerID",
      as: "player"
    }
  },
  { $unwind: "$player" },
  {
    $group: {
      _id: "$player.position",
      avgTransferFee: { $avg: "$transferFee" },
      totalTransfers: { $sum: 1 },
      maxTransferFee: { $max: "$transferFee" },
      totalMarketValue: { $sum: "$transferFee" }
    }
  },
  { $sort: { avgTransferFee: -1 } }
])
```

**Frontend Usage**: Position-based transfer market analysis cards

---

## Query #3: Most Expensive Transfers

**Purpose**: Get top 3 highest value transfers (consumed by frontend expensive transfers showcase)

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "playerID",
      as: "player"
    }
  },
  { $unwind: "$player" },
  {
    $lookup: {
      from: "clubs",
      localField: "fromClubID",
      foreignField: "clubID",
      as: "fromClub"
    }
  },
  { $unwind: "$fromClub" },
  {
    $lookup: {
      from: "clubs",
      localField: "toClubID",
      foreignField: "clubID",
      as: "toClub"
    }
  },
  { $unwind: "$toClub" },
  { $sort: { transferFee: -1 } },
  { $limit: 3 },
  {
    $project: {
      playerName: "$player.name",
      position: "$player.position",
      transferFee: 1,
      fromClub: "$fromClub.clubName",
      toClub: "$toClub.clubName",
      fromLeague: "$fromClub.league",
      toLeague: "$toClub.league",
      date: 1,
      contractYears: 1
    }
  }
])
```

**Frontend Usage**: Expensive transfers highlight cards

---
