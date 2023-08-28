export interface AddDesignation {
    name: string;
    department: string;
}

export interface Designation {
    _id: string;
    name: string;
    department: string;
    departmentName: string;
    employeeCount: string;
    employees: [];
}
