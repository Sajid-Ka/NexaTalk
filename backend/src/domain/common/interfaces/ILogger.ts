export interface ILogger {
    info(message : string, meta?:unknown) : void;
    warn(message : string, meat?:unknown) : void;
    error(message : string, meat?:unknown) : void;
}