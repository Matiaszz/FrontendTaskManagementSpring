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