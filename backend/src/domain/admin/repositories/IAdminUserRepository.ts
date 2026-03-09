import { User } from "../../auth/entities/User";
import { AdminUserQuery } from "../types/AdminUserQuery";

export interface IAdminUserRepository {
    findUsers(query : AdminUserQuery) : Promise<{
        users : User[];
        total :  number;
        page?: number;
        limit : number; 
    }>;
    findById(id : string) : Promise<User | null>;
    update(id : string, data : Partial<User>) : Promise<User | null>;
    delete(id : string) : Promise<void>;
}