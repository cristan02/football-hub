# 🔍 Search & Analytics - MongoDB Queries Documentation

## Overview

Intelligent search system with comprehensive database analytics using regex searches and transfer fee integration.

---

## Query #1: Search Players by Name

**Purpose**: Search players with case-insensitive name matching including transfer history

**MongoDB Query**:

```
db.players.aggregate([
  {
    $match: {
      name: { $regex: "messi", $options: "i" }
    }
  },
  {
    $lookup: {
      from: "transfers",
      localField: "_id",
      foreignField: "playerID",
      as: "transferHistory"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "_id",
      as: "currentClub"
    }
  },
  {
    $addFields: {
      latestTransferFee: {
        $cond: {
          if: { $gt: [{ $size: "$transferHistory" }, 0] },
          then: { $max: "$transferHistory.transferFee" },
          else: null
        }
      },
      totalTransferValue: { $sum: "$transferHistory.transferFee" },
      transferCount: { $size: "$transferHistory" }
    }
  },
  {
    $project: {
      name: 1,
      position: 1,
      age: 1,
      goals: 1,
      assists: 1,
      latestTransferFee: 1,
      totalTransferValue: 1,
      transferCount: 1,
      clubName: { $arrayElemAt: ["$currentClub.name", 0] }
    }
  }
])
```

---

## Query #2: Search Clubs by Name

**Purpose**: Search clubs with matching name pattern and associated statistics

**MongoDB Query**:

```
db.clubs.aggregate([
  {
    $match: {
      name: { $regex: "barcelona", $options: "i" }
    }
  },
  {
    $lookup: {
      from: "players",
      localField: "_id",
      foreignField: "clubID",
      as: "players"
    }
  },
  {
    $lookup: {
      from: "matches",
      localField: "_id",
      foreignField: "homeClubID",
      as: "homeMatches"
    }
  },
  {
    $lookup: {
      from: "matches",
      localField: "_id",
      foreignField: "awayClubID",
      as: "awayMatches"
    }
  },
  {
    $addFields: {
      totalMatches: {
        $add: [
          { $size: "$homeMatches" },
          { $size: "$awayMatches" }
        ]
      },
      playerCount: { $size: "$players" },
      avgPlayerAge: { $avg: "$players.age" }
    }
  },
  {
    $project: {
      name: 1,
      stadium: 1,
      capacity: 1,
      playerCount: 1,
      totalMatches: 1,
      avgPlayerAge: 1
    }
  }
])
```

---

## Query #3: Position Distribution with Market Values

**Purpose**: Analyze position distribution with accurate market values based on transfers

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "transfers",
      localField: "_id",
      foreignField: "playerID",
      as: "transfers"
    }
  },
  {
    $addFields: {
      hasTransfers: { $gt: [{ $size: "$transfers" }, 0] },
      maxTransferFee: { $max: "$transfers.transferFee" }
    }
  },
  {
    $match: { hasTransfers: true }
  },
  {
    $group: {
      _id: "$position",
      averageMarketValue: { $avg: "$maxTransferFee" },
      playerCount: { $sum: 1 },
      totalMarketValue: { $sum: "$maxTransferFee" },
      minMarketValue: { $min: "$maxTransferFee" },
      maxMarketValue: { $max: "$maxTransferFee" }
    }
  },
  {
    $sort: { averageMarketValue: -1 }
  }
])
```

---

## Query #4: Database Overview Statistics

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

## Query #5: Top Players by Transfer Value

**Purpose**: Find players with highest market value based on transfer history

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "transfers",
      localField: "_id",
      foreignField: "playerID",
      as: "transferHistory"
    }
  },
  {
    $match: {
      transferHistory: { $ne: [] }
    }
  },
  {
    $addFields: {
      maxTransferFee: { $max: "$transferHistory.transferFee" },
      totalTransferValue: { $sum: "$transferHistory.transferFee" }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "_id",
      as: "currentClub"
    }
  },
  {
    $sort: { maxTransferFee: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      name: 1,
      position: 1,
      age: 1,
      maxTransferFee: 1,
      totalTransferValue: 1,
      clubName: { $arrayElemAt: ["$currentClub.name", 0] }
    }
  }
])
```

---

## Query #6: Search with Multiple Criteria

**Purpose**: Advanced search with position, age, and club filters

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "_id",
      as: "clubInfo"
    }
  },
  {
    $match: {
      $and: [
        { position: { $regex: "Forward", $options: "i" } },
        { age: { $gte: 20, $lte: 30 } },
        { "clubInfo.name": { $regex: "Real", $options: "i" } }
      ]
    }
  },
  {
    $lookup: {
      from: "transfers",
      localField: "_id",
      foreignField: "playerID",
      as: "transfers"
    }
  },
  {
    $addFields: {
      marketValue: { $max: "$transfers.transferFee" }
    }
  },
  {
    $project: {
      name: 1,
      position: 1,
      age: 1,
      goals: 1,
      assists: 1,
      marketValue: 1,
      clubName: { $arrayElemAt: ["$clubInfo.name", 0] }
    }
  }
])
```

---

## Query #7: Transfer Activity by Club

**Purpose**: Analyze transfer activity and spending patterns by club

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $facet: {
      purchases: [
        {
          $lookup: {
            from: "clubs",
            localField: "toClubID",
            foreignField: "_id",
            as: "club"
          }
        },
        {
          $group: {
            _id: "$toClubID",
            clubName: { $first: { $arrayElemAt: ["$club.name", 0] } },
            totalSpent: { $sum: "$transferFee" },
            purchaseCount: { $sum: 1 }
          }
        }
      ],
      sales: [
        {
          $lookup: {
            from: "clubs",
            localField: "fromClubID",
            foreignField: "_id",
            as: "club"
          }
        },
        {
          $group: {
            _id: "$fromClubID",
            clubName: { $first: { $arrayElemAt: ["$club.name", 0] } },
            totalEarned: { $sum: "$transferFee" },
            saleCount: { $sum: 1 }
          }
        }
      ]
    }
  }
])
```

---

## Query #8: Market Value Distribution

**Purpose**: Analyze market value distribution across different price ranges

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $bucket: {
      groupBy: "$transferFee",
      boundaries: [0, 10000000, 50000000, 100000000, 500000000],
      default: "500M+",
      output: {
        count: { $sum: 1 },
        avgFee: { $avg: "$transferFee" },
        totalValue: { $sum: "$transferFee" }
      }
    }
  }
])
```

---
