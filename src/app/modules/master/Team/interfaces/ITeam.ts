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
    leader: employeeDetails[];
    member: employeeDetails[];
}

export interface DepartmentDetails {
    _id: string;
    name: string;
}

export interface employeeDetails {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
}
