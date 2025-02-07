import { UserGroups } from "../enums/UserGroups"
import { ValueOf } from "./ValueOf"

export type UserType = {
    id: number,
    full_name: string,
    email: string,
    user_type: ValueOf<typeof UserGroups>,
    admin: boolean
}