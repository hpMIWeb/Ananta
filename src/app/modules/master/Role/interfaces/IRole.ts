export interface AddRole {
    roleName: string;
    roleType: string;
    permission: {};
}

export interface Role {
    _id: string;
    roleName: string;
    roleType: string;
    roleTypeName: string;
    userCount: string;
    users: [];
}

export interface RoleType {
    _id: string;
    role_type: string;
}
