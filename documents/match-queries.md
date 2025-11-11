# ⚽ Match Center - MongoDB Queries Documentation

## Overview

Match results and analytics with 4 specific datasets consumed by the frontend: matches with filtering, match statistics, top scoring matches, and attendance analytics.

---

## Query #1: Matches with Club Details and Filtering

**Purpose**: Get matches with home/away club information and dynamic filtering (consumed by frontend match cards)

**MongoDB Query**:

```
db.matches.aggregate([
  { $match: matchQuery }, // Dynamic filtering based on date, club, scores
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "clubID",
      as: "homeClub"
    }
  },
  { $unwind: "$homeClub" },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "clubID",
      as: "awayClub"
    }
  },
  { $unwind: "$awayClub" },
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] },
      scoreDifference: { $abs: { $subtract: ["$homeScore", "$awayScore"] } },
      isHighScoring: { $gt: [{ $add: ["$homeScore", "$awayScore"] }, 4] },
      homeWin: { $gt: ["$homeScore", "$awayScore"] },
      awayWin: { $gt: ["$awayScore", "$homeScore"] },
      draw: { $eq: ["$homeScore", "$awayScore"] }
    }
  },
  { $sort: { date: -1 } }
])
```

**Frontend Usage**: Match results cards with club names, scores, and match details

---

## Query #2: Match Statistics Summary

**Purpose**: Calculate overall match statistics (consumed by frontend statistics overview)

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $group: {
      _id: null,
      totalMatches: { $sum: 1 },
      totalGoals: { $sum: { $add: ["$homeScore", "$awayScore"] } },
      avgGoalsPerMatch: { $avg: { $add: ["$homeScore", "$awayScore"] } },
      highScoringMatches: {
        $sum: {
          $cond: [{ $gt: [{ $add: ["$homeScore", "$awayScore"] }, 4] }, 1, 0]
        }
      },
      homeWins: {
        $sum: {
          $cond: [{ $gt: ["$homeScore", "$awayScore"] }, 1, 0]
        }
      },
      awayWins: {
        $sum: {
          $cond: [{ $gt: ["$awayScore", "$homeScore"] }, 1, 0]
        }
      },
      draws: {
        $sum: {
          $cond: [{ $eq: ["$homeScore", "$awayScore"] }, 1, 0]
        }
      }
    }
  }
])
```

**Frontend Usage**: Match statistics overview cards

---

## Query #3: Top Scoring Matches

**Purpose**: Find highest scoring matches (consumed by frontend top scoring matches section)

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $addFields: {
      totalGoals: { $add: ["$homeScore", "$awayScore"] }
    }
  },
  { $match: { totalGoals: { $gte: 4 } } },
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "clubID",
      as: "homeClub"
    }
  },
  { $unwind: "$homeClub" },
  {
    $lookup: {
      from: "clubs",
      localField: "awayClubID",
      foreignField: "clubID",
      as: "awayClub"
    }
  },
  { $unwind: "$awayClub" },
  { $sort: { totalGoals: -1 } },
  { $limit: 6 }
])
```

**Frontend Usage**: Top scoring matches display cards

---

## Query #4: Attendance Analytics by Club

**Purpose**: Analyze stadium attendance patterns by club (consumed by frontend attendance analytics)

**MongoDB Query**:

```
db.matches.aggregate([
  {
    $match: {
      attendance: { $exists: true, $ne: null, $gt: 0 }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "homeClubID",
      foreignField: "clubID",
      as: "homeClub"
    }
  },
  { $unwind: "$homeClub" },
  {
    $group: {
      _id: "$homeClub.clubName",
      avgAttendance: { $avg: "$attendance" },
      maxAttendance: { $max: "$attendance" },
      totalMatches: { $sum: 1 },
      totalAttendance: { $sum: "$attendance" }
    }
  },
  { $sort: { avgAttendance: -1 } },
  { $limit: 8 }
])
```

**Frontend Usage**: Attendance analytics cards showing club attendance statistics

---

## API Response Structure

**Endpoint**: `/api/matches`

**Returns**:

```json
{
  "matches": [...],
  "matchStats": {...},
  "topScoringMatches": [...],
  "attendanceAnalytics": [...]
}
```

---
