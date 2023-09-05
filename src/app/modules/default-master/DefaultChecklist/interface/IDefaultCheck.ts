export interface AddDefaultCheckList {
    title: string;
    department: string;
    question: QuestionDetails[];
}

export interface DefaultCheckList {
    _id: string;
    title: string;
    roleType: string;
    department: DepartmentDetails;
    question: QuestionDetails[];
}

export interface DepartmentDetails {
    _id: string;
    name: string;
}

export interface QuestionDetails {
    _id: string;
    name: string;
}
