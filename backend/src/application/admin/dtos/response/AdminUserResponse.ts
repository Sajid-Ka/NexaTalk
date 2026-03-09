import { GlobalRole, UserStatus } from "../../../../shared/types/user.types";

export interface AdminUserResponse {
    id : string;
    username : string;
    email : string;
    role : GlobalRole;
    status : UserStatus;
    isBlocked : boolean;
    createdAt : Date;
}