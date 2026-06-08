import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Ensure you have MONGO_URI in your .env file
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/nexatalk";

async function syncServerMemberCounts() {
  try {
    await mongoose.connect(uri);

    const db = mongoose.connection.db;
    if (!db) throw new Error("Could not get db connection");

    // Get all servers
    const serversCursor = db.collection("servers").find({ deletedAt: null });
    const servers = await serversCursor.toArray();

    for (const server of servers) {
      const activeMembersPipeline = [
        { $match: { serverId: server._id.toString() } },
        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] }, deletedAt: null },
              },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },
      ];

      const activeMembers = await db
        .collection("servermembers")
        .aggregate(activeMembersPipeline)
        .toArray();
      const actualCount = activeMembers.length;

      if (server.memberCount !== actualCount) {
        // Update server member count
        await db
          .collection("servers")
          .updateOne({ _id: server._id }, { $set: { memberCount: actualCount } });

        // Cleanup stale ServerMember documents (members whose user is soft deleted)
        // Find all memberships for this server
        const allMembers = await db
          .collection("servermembers")
          .find({ serverId: server._id.toString() })
          .toArray();
        const activeUserIds = new Set(activeMembers.map((m) => m.userId));

        for (const member of allMembers) {
          if (!activeUserIds.has(member.userId)) {
            await db.collection("servermembers").deleteOne({ _id: member._id });
          }
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing counts:", error);
  } finally {
    await mongoose.disconnect();
  }
}

syncServerMemberCounts();
