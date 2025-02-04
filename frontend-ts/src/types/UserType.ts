import { UserGroups } from "../enums/UserGroups"

export type UserType = {
    id: number,
    full_name: string,
    email: string,
    user_type: UserGroups,
    admin: boolean
}