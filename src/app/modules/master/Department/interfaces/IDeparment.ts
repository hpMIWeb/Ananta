export interface AddDepartment {
    name: string;
    description: string;
}

export interface Department {
    DepartmentId: string;
    DepartmentName: string;
    DepartmentDescription: string;
    EmployeeCount: string;
    Employees: [];
}
