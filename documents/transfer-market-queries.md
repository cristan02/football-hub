# 🔄 Transfer Market - MongoDB Queries Documentation

## Overview

Comprehensive transfer market analysis with real-world financial data using complex multi-collection joins.

---

## Query #1: Highest Transfer Fees

**Purpose**: Get transfers with highest fees including player and club details

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "_id",
      as: "playerDetails"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "fromClubID",
      foreignField: "_id",
      as: "fromClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "toClubID",
      foreignField: "_id",
      as: "toClub"
    }
  },
  {
    $sort: { transferFee: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      playerName: { $arrayElemAt: ["$playerDetails.name", 0] },
      transferFee: 1,
      date: 1,
      fromClubName: { $arrayElemAt: ["$fromClub.name", 0] },
      toClubName: { $arrayElemAt: ["$toClub.name", 0] },
      position: { $arrayElemAt: ["$playerDetails.position", 0] }
    }
  }
])
```

---

## Query #2: Transfer Market by Position

**Purpose**: Analyze transfer patterns and average fees by player position

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "_id",
      as: "playerDetails"
    }
  },
  {
    $group: {
      _id: { $arrayElemAt: ["$playerDetails.position", 0] },
      avgTransferFee: { $avg: "$transferFee" },
      totalTransfers: { $sum: 1 },
      maxTransferFee: { $max: "$transferFee" },
      totalMarketValue: { $sum: "$transferFee" }
    }
  },
  {
    $sort: { avgTransferFee: -1 }
  }
])
```

---

## Query #3: Transfer Windows Analysis

**Purpose**: Categorize transfers by transfer windows (Summer/Winter)

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $addFields: {
      transferWindow: {
        $switch: {
          branches: [
            {
              case: { $lte: [{ $month: "$date" }, 2] },
              then: "Winter"
            },
            {
              case: { $lte: [{ $month: "$date" }, 8] },
              then: "Summer"
            },
            {
              case: { $lte: [{ $month: "$date" }, 12] },
              then: "Winter"
            }
          ]
        }
      },
      year: { $year: "$date" }
    }
  },
  {
    $group: {
      _id: {
        window: "$transferWindow",
        year: "$year"
      },
      transferCount: { $sum: 1 },
      totalValue: { $sum: "$transferFee" },
      avgValue: { $avg: "$transferFee" }
    }
  },
  {
    $sort: { "_id.year": -1, "_id.window": 1 }
  }
])
```

---

## Query #4: Most Active Clubs in Transfer Market

**Purpose**: Identify clubs with highest transfer activity (buying and selling)

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "toClubID",
      foreignField: "_id",
      as: "buyingClub"
    }
  },
  {
    $group: {
      _id: "$toClubID",
      clubName: { $first: { $arrayElemAt: ["$buyingClub.name", 0] } },
      totalPurchases: { $sum: 1 },
      totalSpent: { $sum: "$transferFee" },
      avgPurchasePrice: { $avg: "$transferFee" },
      biggestSigning: { $max: "$transferFee" }
    }
  },
  {
    $sort: { totalSpent: -1 }
  },
  {
    $limit: 15
  }
])
```

---

## Query #5: Transfer Fee Trends by Year

**Purpose**: Analyze transfer market inflation and trends over years

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $addFields: {
      year: { $year: "$date" }
    }
  },
  {
    $group: {
      _id: "$year",
      transferCount: { $sum: 1 },
      totalMarketValue: { $sum: "$transferFee" },
      avgTransferFee: { $avg: "$transferFee" },
      maxTransferFee: { $max: "$transferFee" },
      minTransferFee: { $min: "$transferFee" }
    }
  },
  {
    $sort: { _id: -1 }
  }
])
```

---

## Query #6: Free Transfers vs Paid Transfers

**Purpose**: Compare free transfers with paid transfers

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $addFields: {
      transferType: {
        $cond: {
          if: { $eq: ["$transferFee", 0] },
          then: "Free Transfer",
          else: "Paid Transfer"
        }
      }
    }
  },
  {
    $group: {
      _id: "$transferType",
      count: { $sum: 1 },
      avgFee: { $avg: "$transferFee" },
      totalValue: { $sum: "$transferFee" }
    }
  }
])
```

---

## Query #7: Player Transfer History

**Purpose**: Get complete transfer history for a specific player

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "_id",
      as: "playerDetails"
    }
  },
  {
    $match: {
      "playerDetails.name": "Lionel Messi"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "fromClubID",
      foreignField: "_id",
      as: "fromClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "toClubID",
      foreignField: "_id",
      as: "toClub"
    }
  },
  {
    $sort: { date: 1 }
  },
  {
    $project: {
      date: 1,
      transferFee: 1,
      fromClubName: { $arrayElemAt: ["$fromClub.name", 0] },
      toClubName: { $arrayElemAt: ["$toClub.name", 0] },
      playerName: { $arrayElemAt: ["$playerDetails.name", 0] }
    }
  }
])
```

---

## Query #8: Record Transfer by Position

**Purpose**: Find highest transfer fee for each position

**MongoDB Query**:

```
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "playerID",
      foreignField: "_id",
      as: "playerDetails"
    }
  },
  {
    $sort: { transferFee: -1 }
  },
  {
    $group: {
      _id: { $arrayElemAt: ["$playerDetails.position", 0] },
      recordFee: { $first: "$transferFee" },
      playerName: { $first: { $arrayElemAt: ["$playerDetails.name", 0] } },
      date: { $first: "$date" }
    }
  },
  {
    $sort: { recordFee: -1 }
  }
])
```

---
