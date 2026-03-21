export interface IUploadAvatarUsecase {
  execute(userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }>;
}
