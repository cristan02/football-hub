import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  try {
    // Original transfers with lookups
    const transfers = await db
      .collection("transfers")
      .aggregate([
        {
          $lookup: {
            from: "players",
            localField: "playerID",
            foreignField: "playerID",
            as: "player",
          },
        },
        { $unwind: "$player" },
        {
          $lookup: {
            from: "clubs",
            localField: "fromClubID",
            foreignField: "clubID",
            as: "fromClub",
          },
        },
        { $unwind: "$fromClub" },
        {
          $lookup: {
            from: "clubs",
            localField: "toClubID",
            foreignField: "clubID",
            as: "toClub",
          },
        },
        { $unwind: "$toClub" },
        { $sort: { date: -1 } },
      ])
      .toArray();

    // Transfer market analytics by position
    const transferAnalytics = await db
      .collection("transfers")
      .aggregate([
        {
          $lookup: {
            from: "players",
            localField: "playerID",
            foreignField: "playerID",
            as: "player",
          },
        },
        { $unwind: "$player" },
        {
          $lookup: {
            from: "clubs",
            localField: "fromClubID",
            foreignField: "clubID",
            as: "fromClub",
          },
        },
        { $unwind: "$fromClub" },
        {
          $lookup: {
            from: "clubs",
            localField: "toClubID",
            foreignField: "clubID",
            as: "toClub",
          },
        },
        { $unwind: "$toClub" },
        {
          $group: {
            _id: "$player.position",
            avgTransferFee: { $avg: "$transferFee" },
            totalTransfers: { $sum: 1 },
            maxTransferFee: { $max: "$transferFee" },
            minTransferFee: { $min: "$transferFee" },
            avgContractYears: { $avg: "$contractYears" },
            avgPlayerAge: { $avg: "$player.age" },
            totalValue: { $sum: "$transferFee" },
          },
        },
        { $sort: { avgTransferFee: -1 } },
      ])
      .toArray();

    // Most expensive transfers
    const expensiveTransfers = await db
      .collection("transfers")
      .aggregate([
        {
          $lookup: {
            from: "players",
            localField: "playerID",
            foreignField: "playerID",
            as: "player",
          },
        },
        { $unwind: "$player" },
        {
          $lookup: {
            from: "clubs",
            localField: "fromClubID",
            foreignField: "clubID",
            as: "fromClub",
          },
        },
        { $unwind: "$fromClub" },
        {
          $lookup: {
            from: "clubs",
            localField: "toClubID",
            foreignField: "clubID",
            as: "toClub",
          },
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
            contractYears: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      transfers,
      transferAnalytics,
      expensiveTransfers,
    });
  } catch (error) {
    console.error("Transfer analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfer data" },
      { status: 500 }
    );
  }
}
