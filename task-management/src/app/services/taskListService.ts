import { ITaskList } from "@/interfaces/responses";
import api from "./api";

export async function getTaskListByLoggedUser(): Promise<ITaskList[] | null> {
    try {
        const response = await api.get('/taskList');
        return response.data;

    } catch (err) {
        console.error('Failed to get task list by Logged User', err);
        return null;
    }
}

export const createTaskList = async (taskListData: {
    title: string;
    shortDescription: string;
    longDescription: string;
}) => {
    const response = await api.post("/taskList", taskListData);
    return response.data;
};

export const updateTaskList = async (id: string, updatedData: any) => {
    const response = await api.put(`/taskList/${id}`, updatedData);
    return response.data;
};

export const deleteTaskList = async (id: string) => {
    const response = await api.delete(`/taskList/${id}`);
    return response.data;
};