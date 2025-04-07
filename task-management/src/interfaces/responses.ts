export interface IUser {
    id: string;
    username: string;
    role: string;
    name: string;
    lastName: string;
    email: string;
    description: string | null;
    profileImageURL: string;
    enabled: boolean;
    authorities: {
        authority: string;
    }[];
}

export interface ITask {
    id: string,
    name: string,
    shortDescription: string,
    longDescription: string,
    isDone: boolean
}

export interface ITaskList {
    id: string,
    title: string,
    shortDescription: string,
    longDescription: string,
    color: string,
    tasks: ITask[]
}

export interface ITaskUpdateRequest {
    name?: string;
    shortDescription?: string;
    longDescription?: string;
    isDone?: boolean;
}