export interface AddDepartment {
    name: string;
    description: string;
}

export interface Department {
    _id: string;
    name: string;
    description: string;
    employeeCount: string;
    employees: [];
}
