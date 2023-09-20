export interface AddDefaultDepartment {
    name: string;
    description: string;
}

export interface DefaultDepartment {
    _id: string;
    name: string;
    description: string;
    employeeCount: string;
    employees: [];
}
