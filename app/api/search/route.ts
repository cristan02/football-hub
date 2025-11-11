import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const type = url.searchParams.get("type") || "player";

  const client = await clientPromise;
  const db = client.db();
  let results: any[] = [];

  if (type === "player") {
    const matchQuery = q
      ? {
          name: { $regex: q, $options: "i" },
        }
      : {};

    results = await db
      .collection("players")
      .aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: "clubs",
            localField: "clubID",
            foreignField: "clubID",
            as: "club",
          },
        },
        {
          $lookup: {
            from: "transfers",
            localField: "playerID",
            foreignField: "playerID",
            as: "transfers",
          },
        },
        {
          $addFields: {
            latestTransferFee: {
              $cond: [
                { $gt: [{ $size: "$transfers" }, 0] },
                { $max: "$transfers.transferFee" },
                0,
              ],
            },
          },
        },
        { $unwind: { path: "$club", preserveNullAndEmptyArrays: true } },
        { $sort: { name: 1 } },
        { $limit: q ? 50 : 20 },
      ])
      .toArray();
  } else if (type === "club") {
    const matchQuery = q
      ? {
          clubName: { $regex: q, $options: "i" },
        }
      : {};

    results = await db
      .collection("clubs")
      .aggregate([
        { $match: matchQuery },
        { $sort: { clubName: 1 } },
        { $limit: q ? 50 : 20 },
      ])
      .toArray();
  }

  // Database search analytics with transfer fees as market value
  const searchAnalytics = await db
    .collection("players")
    .aggregate([
      {
        $lookup: {
          from: "transfers",
          localField: "playerID",
          foreignField: "playerID",
          as: "transfers",
        },
      },
      {
        $addFields: {
          latestTransferFee: {
            $cond: [
              { $gt: [{ $size: "$transfers" }, 0] },
              { $max: "$transfers.transferFee" },
              null,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$position",
          playerCount: { $sum: 1 },
          avgAge: { $avg: "$age" },
          playersWithTransfers: {
            $sum: {
              $cond: [{ $ne: ["$latestTransferFee", null] }, 1, 0],
            },
          },
          avgMarketValue: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$latestTransferFee", null] },
                    { $gt: ["$latestTransferFee", 0] },
                  ],
                },
                "$latestTransferFee",
                null,
              ],
            },
          },
        },
      },
      { $sort: { playerCount: -1 } },
    ])
    .toArray();

  // Popular nationalities with transfer fees
  const nationalityStats = await db
    .collection("players")
    .aggregate([
      {
        $lookup: {
          from: "transfers",
          localField: "playerID",
          foreignField: "playerID",
          as: "transfers",
        },
      },
      {
        $addFields: {
          latestTransferFee: {
            $cond: [
              { $gt: [{ $size: "$transfers" }, 0] },
              { $max: "$transfers.transferFee" },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$nationality",
          playerCount: { $sum: 1 },
          avgMarketValue: { $avg: "$latestTransferFee" },
        },
      },
      { $sort: { playerCount: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  // League distribution
  const leagueStats = await db
    .collection("clubs")
    .aggregate([
      {
        $group: {
          _id: "$league",
          clubCount: { $sum: 1 },
          avgFoundedYear: { $avg: { $toInt: "$founded" } },
        },
      },
      { $sort: { clubCount: -1 } },
    ])
    .toArray();

  // Top players by transfer value
  const topPlayers = await db
    .collection("players")
    .aggregate([
      {
        $lookup: {
          from: "transfers",
          localField: "playerID",
          foreignField: "playerID",
          as: "transfers",
        },
      },
      {
        $addFields: {
          latestTransferFee: {
            $cond: [
              { $gt: [{ $size: "$transfers" }, 0] },
              { $max: "$transfers.transferFee" },
              0,
            ],
          },
        },
      },
      { $match: { latestTransferFee: { $gt: 0 } } },
      {
        $lookup: {
          from: "clubs",
          localField: "clubID",
          foreignField: "clubID",
          as: "club",
        },
      },
      { $unwind: { path: "$club", preserveNullAndEmptyArrays: true } },
      { $sort: { latestTransferFee: -1 } },
      { $limit: 8 },
    ])
    .toArray();

  return NextResponse.json({
    results,
    searchAnalytics,
    nationalityStats,
    leagueStats,
    topPlayers,
    searchQuery: q,
    searchType: type,
    resultCount: results.length,
  });
}
