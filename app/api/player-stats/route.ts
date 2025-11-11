import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  try {
    // Original aggregation by position
    const players = await db.collection("players").find({}).toArray();
    const positionStats: Record<
      string,
      {
        count: number;
        totalAge: number;
        totalGoals: number;
        totalAssists: number;
      }
    > = {};
    const nationalityStats: Record<string, number> = {};

    for (const p of players) {
      if (!positionStats[p.position]) {
        positionStats[p.position] = {
          count: 0,
          totalAge: 0,
          totalGoals: 0,
          totalAssists: 0,
        };
      }
      positionStats[p.position].count++;
      positionStats[p.position].totalAge += p.age;
      positionStats[p.position].totalGoals += p.goals;
      positionStats[p.position].totalAssists += p.assists;
      nationalityStats[p.nationality] =
        (nationalityStats[p.nationality] || 0) + 1;
    }

    const positions = Object.entries(positionStats).map(
      ([position, stats]) => ({
        position,
        count: stats.count,
        avgAge: stats.totalAge / stats.count,
        avgGoals: stats.totalGoals / stats.count,
        avgAssists: stats.totalAssists / stats.count,
      })
    );
    const nationalities = Object.entries(nationalityStats).map(
      ([nationality, count]) => ({ nationality, count })
    );

    // Advanced MongoDB aggregation for top performers
    const topPerformers = await db
      .collection("players")
      .aggregate([
        {
          $lookup: {
            from: "clubs",
            localField: "clubID",
            foreignField: "clubID",
            as: "club",
          },
        },
        { $unwind: "$club" },
        {
          $addFields: {
            performanceScore: {
              $add: [
                { $multiply: ["$goals", 2] },
                "$assists",
                { $subtract: [35, "$age"] },
              ],
            },
          },
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
            league: "$club.league",
          },
        },
      ])
      .toArray();

    // League analytics using advanced aggregation
    const leagueAnalytics = await db
      .collection("players")
      .aggregate([
        {
          $lookup: {
            from: "clubs",
            localField: "clubID",
            foreignField: "clubID",
            as: "club",
          },
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
            maxGoals: { $max: "$goals" },
            topScorer: {
              $first: {
                $cond: [{ $eq: ["$goals", { $max: "$goals" }] }, "$name", null],
              },
            },
          },
        },
        {
          $addFields: {
            avgGoalsPerPlayer: { $divide: ["$totalGoals", "$playerCount"] },
            avgAssistsPerPlayer: { $divide: ["$totalAssists", "$playerCount"] },
          },
        },
        { $sort: { totalGoals: -1 } },
      ])
      .toArray();

    return NextResponse.json({
      positions,
      nationalities,
      topPerformers,
      leagueAnalytics,
    });
  } catch (error) {
    console.error("Player stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch player statistics" },
      { status: 500 }
    );
  }
}
