export const normalizeParticipantIds = (participantIds: string[]): string[] => {
  return [...participantIds].sort();
};
