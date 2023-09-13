export interface AddCheckList {
    title: string;
    department: string;
    question: QuestionDetails[];
}

export interface CheckList {
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
