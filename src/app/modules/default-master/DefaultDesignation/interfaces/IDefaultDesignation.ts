export interface AddDefaultDesignation {
    name: string;
    department: string;
}

export interface DefaultDesignation {
    _id: string;
    name: string;
    department: string;
    departmentName: string;
    employeeCount: string;
    employees: [];
}
