export interface AddDefaultRole {
    roleName: string;
    roleType: string;
    permission: {};
}

export interface DefaultRole {
    _id: string;
    roleName: string;
    roleType: string;
    roleTypeName: string;
    userCount: string;
    users: [];
}

export interface DefaultRoleType {
    _id: string;
    role_type: string;
}
