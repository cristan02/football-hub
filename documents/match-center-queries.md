# ⚽ Match Center - MongoDB Queries Documentation

## Overview

Match results, fixtures, and match analytics with dynamic filtering capabilities and comprehensive statistics.

---

## Query #1: Recent Matches with Club Details

**Purpose**: Get recent matches with home and away club information

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $sort: { date: -1 }
  },
  {
    $limit: 20
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      attendance: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] },
      homeClubStadium: { $arrayElemAt: ["$homeClub.stadium", 0] },
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  }
])
```

---

## Query #2: Matches by Date Range

**Purpose**: Filter matches within specific date range

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2024-01-01"),
        $lte: ISODate("2024-12-31")
      }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $sort: { date: -1 }
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      attendance: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] }
    }
  }
])
```

---

## Query #3: Matches by Specific Club

**Purpose**: Get all matches for a specific club (home or away)

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $match: {
      $or: [
        { "homeClub.name": { $regex: "Barcelona", $options: "i" } },
        { "awayClub.name": { $regex: "Barcelona", $options: "i" } }
      ]
    }
  },
  {
    $addFields: {
      isHomeMatch: {
        $cond: {
          if: { $regexMatch: { input: { $arrayElemAt: ["$homeClub.name", 0] }, regex: "Barcelona", options: "i" } },
          then: true,
          else: false
        }
      }
    }
  },
  {
    $sort: { date: -1 }
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      attendance: 1,
      isHomeMatch: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] }
    }
  }
])
```

---

## Query #4: High Scoring Matches

**Purpose**: Find matches with total goals above a threshold

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  },
  {
    $match: {
      totalGoals: { $gte: 5 }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $sort: { totalGoals: -1 }
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      totalGoals: 1,
      attendance: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] }
    }
  }
])
```

---

## Query #5: Attendance Analytics

**Purpose**: Analyze stadium attendance patterns and statistics

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $addFields: {
      attendanceRate: {
        $divide: [
          "$attendance",
          { $arrayElemAt: ["$homeClub.capacity", 0] }
        ]
      }
    }
  },
  {
    $group: {
      _id: { $arrayElemAt: ["$homeClub.name", 0] },
      avgAttendance: { $avg: "$attendance" },
      maxAttendance: { $max: "$attendance" },
      minAttendance: { $min: "$attendance" },
      avgAttendanceRate: { $avg: "$attendanceRate" },
      totalMatches: { $sum: 1 },
      stadium: { $first: { $arrayElemAt: ["$homeClub.stadium", 0] } },
      capacity: { $first: { $arrayElemAt: ["$homeClub.capacity", 0] } }
    }
  },
  {
    $sort: { avgAttendance: -1 }
  }
])
```

---

## Query #6: Goal Distribution Analysis

**Purpose**: Analyze goal scoring patterns and match outcomes

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] },
      goalDifference: { $abs: { $subtract: ["$homeScore", "$awayScore"] } },
      matchResult: {
        $switch: {
          branches: [
            { case: { $gt: ["$homeScore", "$awayScore"] }, then: "Home Win" },
            { case: { $lt: ["$homeScore", "$awayScore"] }, then: "Away Win" },
            { case: { $eq: ["$homeScore", "$awayScore"] }, then: "Draw" }
          ]
        }
      }
    }
  },
  {
    $group: {
      _id: "$matchResult",
      count: { $sum: 1 },
      avgTotalGoals: { $avg: "$totalGoals" },
      avgGoalDifference: { $avg: "$goalDifference" },
      highestScoringMatch: { $max: "$totalGoals" }
    }
  }
])
```

---

## Query #7: Monthly Match Statistics

**Purpose**: Analyze match frequency and statistics by month

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $addFields: {
      month: { $month: "$date" },
      year: { $year: "$date" },
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  },
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year"
      },
      matchCount: { $sum: 1 },
      avgGoalsPerMatch: { $avg: "$totalGoals" },
      avgAttendance: { $avg: "$attendance" },
      totalGoals: { $sum: "$totalGoals" }
    }
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1 }
  }
])
```

---

## Query #8: Head-to-Head Records

**Purpose**: Analyze head-to-head record between two specific clubs

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $match: {
      $or: [
        {
          $and: [
            { "homeClub.name": { $regex: "Barcelona", $options: "i" } },
            { "awayClub.name": { $regex: "Real Madrid", $options: "i" } }
          ]
        },
        {
          $and: [
            { "homeClub.name": { $regex: "Real Madrid", $options: "i" } },
            { "awayClub.name": { $regex: "Barcelona", $options: "i" } }
          ]
        }
      ]
    }
  },
  {
    $addFields: {
      matchResult: {
        $switch: {
          branches: [
            { case: { $gt: ["$homeScore", "$awayScore"] }, then: "Home Win" },
            { case: { $lt: ["$homeScore", "$awayScore"] }, then: "Away Win" },
            { case: { $eq: ["$homeScore", "$awayScore"] }, then: "Draw" }
          ]
        }
      }
    }
  },
  {
    $sort: { date: -1 }
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      matchResult: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] }
    }
  }
])
```

---

## Query #9: Dynamic Multi-Filter Search

**Purpose**: Advanced filtering with multiple parameters (date, club, score range)

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  },
  {
    $match: {
      $and: [
        { date: { $gte: ISODate("2024-01-01") } },
        { date: { $lte: ISODate("2024-12-31") } },
        { totalGoals: { $gte: 2 } },
        { totalGoals: { $lte: 6 } },
        { attendance: { $gte: 30000 } }
      ]
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "_id",
      as: "awayClub"
    }
  },
  {
    $sort: { date: -1 }
  },
  {
    $project: {
      date: 1,
      homeScore: 1,
      awayScore: 1,
      totalGoals: 1,
      attendance: 1,
      homeClubName: { $arrayElemAt: ["$homeClub.name", 0] },
      awayClubName: { $arrayElemAt: ["$awayClub.name", 0] }
    }
  }
])
```

---

## Query #10: Stadium Performance Analysis

**Purpose**: Analyze performance metrics by stadium/venue

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "_id",
      as: "homeClub"
    }
  },
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  },
  {
    $group: {
      _id: {
        stadium: { $arrayElemAt: ["$homeClub.stadium", 0] },
        club: { $arrayElemAt: ["$homeClub.name", 0] }
      },
      matchesPlayed: { $sum: 1 },
      avgAttendance: { $avg: "$attendance" },
      maxAttendance: { $max: "$attendance" },
      avgGoalsPerMatch: { $avg: "$totalGoals" },
      homeWins: {
        $sum: {
          $cond: [{ $gt: ["$homeScore", "$awayScore"] }, 1, 0]
        }
      },
      draws: {
        $sum: {
          $cond: [{ $eq: ["$homeScore", "$awayScore"] }, 1, 0]
        }
      },
      homeLosses: {
        $sum: {
          $cond: [{ $lt: ["$homeScore", "$awayScore"] }, 1, 0]
        }
      }
    }
  },
  {
    $addFields: {
      homeWinRate: { $divide: ["$homeWins", "$matchesPlayed"] }
    }
  },
  {
    $sort: { homeWinRate: -1 }
  }
])
```

---
