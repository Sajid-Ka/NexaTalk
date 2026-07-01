export interface GroupResponse {
  id: string;
  name: string;
  avatar?: string;
  ownerId: string;
  participantIds: string[];
  createdAt: Date;
}
