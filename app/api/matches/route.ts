import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const club = url.searchParams.get("club");
  const minScore = url.searchParams.get("minScore");
  const maxScore = url.searchParams.get("maxScore");

  const client = await clientPromise;
  const db = client.db();
  const matchQuery: any = {};
  if (date) matchQuery.date = new Date(date);
  if (club) matchQuery.$or = [{ homeClubID: club }, { awayClubID: club }];
  if (minScore) matchQuery.homeScore = { $gte: Number(minScore) };
  if (maxScore) matchQuery.awayScore = { $lte: Number(maxScore) };

  // Main matches with club details
  const matches = await db
    .collection("matches")
    .aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "clubs",
          localField: "homeClubID",
          foreignField: "clubID",
          as: "homeClub",
        },
      },
      { $unwind: "$homeClub" },
      {
        $lookup: {
          from: "clubs",
          localField: "awayClubID",
          foreignField: "clubID",
          as: "awayClub",
        },
      },
      { $unwind: "$awayClub" },
      {
        $addFields: {
          totalGoals: { $add: ["$homeScore", "$awayScore"] },
          scoreDifference: {
            $abs: { $subtract: ["$homeScore", "$awayScore"] },
          },
          isHighScoring: { $gt: [{ $add: ["$homeScore", "$awayScore"] }, 4] },
          homeWin: { $gt: ["$homeScore", "$awayScore"] },
          awayWin: { $gt: ["$awayScore", "$homeScore"] },
          isDraw: { $eq: ["$homeScore", "$awayScore"] },
        },
      },
      { $sort: { date: -1 } },
    ])
    .toArray();

  // Match Statistics Analytics
  const matchStats = await db
    .collection("matches")
    .aggregate([
      {
        $addFields: {
          totalGoals: { $add: ["$homeScore", "$awayScore"] },
          scoreDifference: {
            $abs: { $subtract: ["$homeScore", "$awayScore"] },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalMatches: { $sum: 1 },
          avgGoalsPerMatch: { $avg: "$totalGoals" },
          highScoringMatches: {
            $sum: { $cond: [{ $gt: ["$totalGoals", 4] }, 1, 0] },
          },
          draws: {
            $sum: { $cond: [{ $eq: ["$homeScore", "$awayScore"] }, 1, 0] },
          },
          homeWins: {
            $sum: { $cond: [{ $gt: ["$homeScore", "$awayScore"] }, 1, 0] },
          },
          awayWins: {
            $sum: { $cond: [{ $gt: ["$awayScore", "$homeScore"] }, 1, 0] },
          },
          maxGoalsInMatch: { $max: "$totalGoals" },
          avgScoreDifference: { $avg: "$scoreDifference" },
          totalAttendance: { $sum: "$attendance" },
          avgAttendance: { $avg: "$attendance" },
        },
      },
      {
        $addFields: {
          homeWinPercentage: {
            $multiply: [{ $divide: ["$homeWins", "$totalMatches"] }, 100],
          },
          awayWinPercentage: {
            $multiply: [{ $divide: ["$awayWins", "$totalMatches"] }, 100],
          },
          drawPercentage: {
            $multiply: [{ $divide: ["$draws", "$totalMatches"] }, 100],
          },
          highScoringPercentage: {
            $multiply: [
              { $divide: ["$highScoringMatches", "$totalMatches"] },
              100,
            ],
          },
        },
      },
    ])
    .toArray();

  // Top Scoring Matches
  const topScoringMatches = await db
    .collection("matches")
    .aggregate([
      {
        $addFields: {
          totalGoals: { $add: ["$homeScore", "$awayScore"] },
        },
      },
      {
        $lookup: {
          from: "clubs",
          localField: "homeClubID",
          foreignField: "clubID",
          as: "homeClub",
        },
      },
      { $unwind: "$homeClub" },
      {
        $lookup: {
          from: "clubs",
          localField: "awayClubID",
          foreignField: "clubID",
          as: "awayClub",
        },
      },
      { $unwind: "$awayClub" },
      { $sort: { totalGoals: -1, date: -1 } },
      { $limit: 5 },
    ])
    .toArray();

  // Attendance Analytics
  const attendanceAnalytics = await db
    .collection("matches")
    .aggregate([
      {
        $match: {
          attendance: { $exists: true, $ne: null, $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "clubs",
          localField: "homeClubID",
          foreignField: "clubID",
          as: "homeClub",
        },
      },
      { $unwind: "$homeClub" },
      {
        $group: {
          _id: "$homeClub.clubName",
          avgAttendance: { $avg: "$attendance" },
          maxAttendance: { $max: "$attendance" },
          totalMatches: { $sum: 1 },
          totalAttendance: { $sum: "$attendance" },
        },
      },
      { $sort: { avgAttendance: -1 } },
      { $limit: 8 },
    ])
    .toArray();

  return NextResponse.json({
    matches,
    matchStats: matchStats[0] || {},
    topScoringMatches,
    attendanceAnalytics,
  });
}
