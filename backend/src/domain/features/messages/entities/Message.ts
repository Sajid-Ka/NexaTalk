export interface MessageProps {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
  hiddenForUserIds?: string[];
}

export class Message {
  public readonly id: string;
  public readonly conversationId: string;
  public readonly senderId: string;
  public content: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public editedAt: Date | null;
  public deletedAt: Date | null;
  public hiddenForUserIds: string[];

  constructor(props: MessageProps) {
    if (!props.conversationId) throw new Error("Conversation ID is required");
    if (!props.senderId) throw new Error("Sender ID is required");
    if (!props.content.trim()) throw new Error("Message content is required");

    this.id = props.id!;
    this.conversationId = props.conversationId;
    this.senderId = props.senderId;
    this.content = props.content;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.editedAt = props.editedAt ?? null;
    this.deletedAt = props.deletedAt ?? null;
    this.hiddenForUserIds = props.hiddenForUserIds ?? [];
  }
}
