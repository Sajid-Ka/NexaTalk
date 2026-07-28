export const MESSAGES_TYPES = {
  // repositories
  ConversationRepository: Symbol.for("ConversationRepository"),
  ConversationParticipantRepository: Symbol.for("ConversationParticipantRepository"),
  MessageRepository: Symbol.for("MessageRepository"),

  // usecases
  CreateDirectConversation: Symbol.for("CreateDirectConversationUsecase"),
  CreateGroup: Symbol.for("CreateGroup"),
  GetDirectConversations: Symbol.for("GetDirectConversations"),
  GetConversationMessages: Symbol.for("GetConversationMessages"),
  SendMessage: Symbol.for("SendMessage"),
  EditMessage: Symbol.for("EditMessage"),
  DeleteMessage: Symbol.for("DeleteMessage"),
  MarkAsRead: Symbol.for("MarkAsRead"),
  GetGroups: Symbol.for("GetGroups"),
  DeleteMessageForMe: Symbol.for("DeleteMessageForMe"),
  UpdateGroupMemberRole: Symbol.for("UpdateGroupMemberRole"),
  RemoveGroupMember: Symbol.for("RemoveGroupMember"),
  LeaveGroup: Symbol.for("LeaveGroup"),
  TransferGroupOwnership: Symbol.for("TransferGroupOwnership"),
  DeleteGroup: Symbol.for("DeleteGroup"),
  AddGroupMembers: Symbol.for("AddGroupMembers"),
  UploadGroupAvatar: Symbol.for("UploadGroupAvatar"),
  RenameGroup: Symbol.for("RenameGroup"),

  // controllers
  ConversationController: Symbol.for("ConversationController"),
  MessageController: Symbol.for("MessageController"),
} as const;
