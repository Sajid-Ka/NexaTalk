export interface ILogoutAllDeviceUsecase {
    execute(userId : string) : Promise<void>;
}