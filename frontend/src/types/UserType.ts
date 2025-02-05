import { UserGroups } from "../enums/UserGroups"
import { LoadEnumValues } from "./LoadEnumValues"

export type UserType = {
    id: number,
    full_name: string,
    email: string,
    user_type: LoadEnumValues<UserGroups>,
    admin: boolean
}