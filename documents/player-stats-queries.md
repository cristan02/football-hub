# 📊 Player Statistics - MongoDB Queries Documentation

## Overview

Player analytics page with 4 specific datasets consumed by the frontend: position statistics, nationality distribution, top performers, and league analytics.

---

## Query #1: Position Distribution Statistics

**Purpose**: Group players by position with statistical calculations (consumed by frontend position cards)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $group: {
      _id: "$position",
      count: { $sum: 1 },
      totalAge: { $sum: "$age" },
      totalGoals: { $sum: "$goals" },
      totalAssists: { $sum: "$assists" }
    }
  }
])
```

**Frontend Usage**: Position cards with count, avgAge, avgGoals, avgAssists

---

## Query #2: Nationality Distribution

**Purpose**: Count players by nationality (consumed by frontend nationality section)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $group: {
      _id: "$nationality",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])
```

**Frontend Usage**: Nationality statistics display

---

## Query #3: Top Performers with Performance Score

**Purpose**: Get top 5 players with calculated performance score (consumed by frontend top performers table)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "clubID",
      as: "club"
    }
  },
  { $unwind: "$club" },
  {
    $addFields: {
      performanceScore: {
        $add: [
          { $multiply: ["$goals", 2] },
          "$assists",
          { $subtract: [35, "$age"] }
        ]
      }
    }
  },
  { $sort: { performanceScore: -1 } },
  { $limit: 5 },
  {
    $project: {
      name: 1,
      position: 1,
      goals: 1,
      assists: 1,
      age: 1,
      performanceScore: 1,
      clubName: "$club.clubName",
      league: "$club.league"
    }
  }
])
```

**Frontend Usage**: Top performers ranking table

---

## Query #4: League Analytics

**Purpose**: Aggregate player statistics by league (consumed by frontend league analytics section)

**MongoDB Query**:

```
db.players.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "clubID",
      foreignField: "clubID",
      as: "club"
    }
  },
  { $unwind: "$club" },
  {
    $group: {
      _id: "$club.league",
      playerCount: { $sum: 1 },
      avgAge: { $avg: "$age" },
      totalGoals: { $sum: "$goals" },
      totalAssists: { $sum: "$assists" },
      avgSalary: { $avg: "$salary" },
      maxGoals: { $max: "$goals" }
    }
  },
  {
    $addFields: {
      avgGoalsPerPlayer: { $divide: ["$totalGoals", "$playerCount"] },
      avgAssistsPerPlayer: { $divide: ["$totalAssists", "$playerCount"] }
    }
  },
  { $sort: { totalGoals: -1 } }
])
```

**Frontend Usage**: League comparison cards with statistics

---
