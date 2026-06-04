import { injectable } from "inversify";
import { Types } from "mongoose";
import { ServerDirectInvite } from "../../../../domain/features/servers/entities/ServerDirectInvite";
import { IServerDirectInviteRepository } from "../../../../domain/features/servers/repositories/IServerDirectInviteRepository";
import { PendingDirectInviteResponse } from "../../../../application/servers/invites/dtos/responses/PendingDirectInviteResponse";
import { ServerDirectInviteModel, IServerDirectInviteDoc } from "../models/ServerDirectInviteModel";

@injectable()
export class ServerDirectInviteRepository implements IServerDirectInviteRepository {
  private toIdString(value: unknown): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value instanceof Types.ObjectId) return value.toString();
    if (typeof value === "object" && value !== null && "_id" in value) {
      return this.toIdString((value as { _id: unknown })._id);
    }
    return String(value);
  }

  private mapToDomain(doc: IServerDirectInviteDoc): ServerDirectInvite {
    return {
      id: doc._id.toString(),
      serverId: this.toIdString(doc.serverId),
      senderId: this.toIdString(doc.senderId),
      receiverId: this.toIdString(doc.receiverId),
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }

  private mapPopulatedForReceiver(doc: IServerDirectInviteDoc): PendingDirectInviteResponse {
    const server = doc.serverId as unknown as {
      _id: Types.ObjectId;
      name: string;
      icon?: string;
    };
    const sender = doc.senderId as unknown as {
      _id: Types.ObjectId;
      username: string;
      avatar?: string;
    };

    return {
      id: doc._id.toString(),
      serverId: {
        _id: server._id.toString(),
        name: server.name,
        icon: server.icon,
      },
      senderId: {
        _id: sender._id.toString(),
        username: sender.username,
        avatar: sender.avatar,
      },
      receiverId: this.toIdString(doc.receiverId),
      status: "pending",
      createdAt: doc.createdAt,
    };
  }

  async create(data: Omit<ServerDirectInvite, "id" | "createdAt">): Promise<ServerDirectInvite> {
    const invite = new ServerDirectInviteModel(data);
    const saved = await invite.save();
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<ServerDirectInvite | null> {
    const doc = await ServerDirectInviteModel.findById(id).lean();
    return doc ? this.mapToDomain(doc as IServerDirectInviteDoc) : null;
  }

  async findPendingByReceiver(receiverId: string): Promise<PendingDirectInviteResponse[]> {
    const docs = await ServerDirectInviteModel.find({
      receiverId,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("serverId", "name icon")
      .populate("senderId", "username avatar")
      .lean()
      .exec();

    return docs.map((doc) => this.mapPopulatedForReceiver(doc as IServerDirectInviteDoc));
  }

  async findPendingByServerAndReceiver(
    serverId: string,
    receiverId: string,
  ): Promise<ServerDirectInvite | null> {
    const doc = await ServerDirectInviteModel.findOne({
      serverId,
      receiverId,
      status: "pending",
    }).lean();

    return doc ? this.mapToDomain(doc as IServerDirectInviteDoc) : null;
  }

  async findPendingByServerAndSender(
    serverId: string,
    senderId: string,
  ): Promise<ServerDirectInvite[]> {
    const docs = await ServerDirectInviteModel.find({
      serverId,
      senderId,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return docs.map((doc) => this.mapToDomain(doc as IServerDirectInviteDoc));
  }

  async updateStatus(id: string, status: "accepted" | "rejected"): Promise<ServerDirectInvite> {
    const doc = await ServerDirectInviteModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean();

    if (!doc) throw new Error("Invite not found");

    return this.mapToDomain(doc as IServerDirectInviteDoc);
  }

  async rejectOtherPendingForServer(
    serverId: string,
    receiverId: string,
    exceptInviteId: string,
  ): Promise<void> {
    await ServerDirectInviteModel.updateMany(
      {
        _id: { $ne: exceptInviteId },
        serverId,
        receiverId,
        status: "pending",
      },
      { status: "rejected" },
    );
  }
}
