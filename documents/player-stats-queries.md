# 📊 Player Statistics - MongoDB Queries Documentation

## Overview

Advanced player analytics with comprehensive performance insights using complex aggregation pipelines.

---

## Query #1: Top Players by Goals

**Purpose**: Get top 10 players with highest goal count including club information

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
    $sort: { goals: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      name: 1,
      goals: 1,
      assists: 1,
      position: 1,
      clubName: { $arrayElemAt: ["$clubInfo.name", 0] }
    }
  }
])
```

---

## Query #2: Position Distribution with Statistics

**Purpose**: Group players by position with average statistics

**MongoDB Query**:

```
db.players.aggregate([
  {
    $group: {
      _id: "$position",
      avgAge: { $avg: "$age" },
      avgGoals: { $avg: "$goals" },
      avgAssists: { $avg: "$assists" },
      totalPlayers: { $sum: 1 },
      maxGoals: { $max: "$goals" },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" }
    }
  },
  {
    $sort: { totalPlayers: -1 }
  }
])
```

---

## Query #3: Players with Performance Score

**Purpose**: Calculate performance score based on goals, assists, and appearances

**MongoDB Query**:

```
db.players.aggregate([
  {
    $addFields: {
      performanceScore: {
        $add: [
          { $multiply: ["$goals", 3] },
          { $multiply: ["$assists", 2] },
          "$appearances"
        ]
      }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "_id",
      as: "clubInfo"
    }
  },
  {
    $sort: { performanceScore: -1 }
  },
  {
    $limit: 20
  },
  {
    $project: {
      name: 1,
      goals: 1,
      assists: 1,
      appearances: 1,
      performanceScore: 1,
      position: 1,
      clubName: { $arrayElemAt: ["$clubInfo.name", 0] }
    }
  }
])
```

---

## Query #4: Nationality Distribution

**Purpose**: Analyze player distribution by nationality

**MongoDB Query**:

```
db.players.aggregate([
  {
    $group: {
      _id: "$nationality",
      playerCount: { $sum: 1 },
      avgAge: { $avg: "$age" },
      totalGoals: { $sum: "$goals" },
      totalAssists: { $sum: "$assists" }
    }
  },
  {
    $sort: { playerCount: -1 }
  },
  {
    $limit: 15
  }
])
```

---

## Query #5: League-wise Player Analytics

**Purpose**: Cross-reference player data with club leagues

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
    $lookup: {
      from: "leagues",
      localField: "clubInfo.leagueID",
      foreignField: "_id",
      as: "leagueInfo"
    }
  },
  {
    $group: {
      _id: { $arrayElemAt: ["$leagueInfo.name", 0] },
      totalPlayers: { $sum: 1 },
      avgAge: { $avg: "$age" },
      totalGoals: { $sum: "$goals" },
      avgGoalsPerPlayer: { $avg: "$goals" },
      topScorer: { $max: "$goals" }
    }
  },
  {
    $sort: { totalPlayers: -1 }
  }
])
```

---

## Query #6: Young Talent Analysis

**Purpose**: Find promising young players with good performance

**MongoDB Query**:

```
db.players.aggregate([
  {
    $match: {
      age: { $lte: 23 },
      goals: { $gte: 5 }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "_id",
      as: "clubInfo"
    }
  },
  {
    $addFields: {
      goalsPerAge: { $divide: ["$goals", "$age"] }
    }
  },
  {
    $sort: { goalsPerAge: -1 }
  },
  {
    $project: {
      name: 1,
      age: 1,
      goals: 1,
      assists: 1,
      position: 1,
      goalsPerAge: 1,
      clubName: { $arrayElemAt: ["$clubInfo.name", 0] }
    }
  }
])
```

---

## Query #7: Position-wise Goal Distribution

**Purpose**: Analyze goal scoring patterns by position

**MongoDB Query**:

```
db.players.aggregate([
  {
    $match: {
      goals: { $gt: 0 }
    }
  },
  {
    $group: {
      _id: "$position",
      avgGoals: { $avg: "$goals" },
      totalGoals: { $sum: "$goals" },
      topScorer: { $max: "$goals" },
      scoringPlayers: { $sum: 1 }
    }
  },
  {
    $addFields: {
      goalsPerPlayer: { $divide: ["$totalGoals", "$scoringPlayers"] }
    }
  },
  {
    $sort: { avgGoals: -1 }
  }
])
```

---
