export interface AddDesignation {
    name: string;
    department: string;
}

export interface Designation {
    DesignationId: string;
    DesignationName: string;
    DepartmentId: string;
    DepartmentName: string;
    EmployeeCount: string;
    Employees: [];
}
