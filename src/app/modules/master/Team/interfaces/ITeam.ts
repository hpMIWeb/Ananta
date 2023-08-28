export interface AddTeam {
    name: string;
    department: string;
    leader: string[];
    member: string[];
}

export interface Team {
    _id: string;
    name: string;
    department: DepartmentDetails;
    leader: [];
    member: [];
}

export interface DepartmentDetails {
    _id: string;
    name: string;
}
