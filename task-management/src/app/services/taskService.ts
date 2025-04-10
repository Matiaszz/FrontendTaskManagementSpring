import api from "./api";
import { ITask, ITaskUpdateRequest } from "@/interfaces/responses";

export const toggleTaskStatus = async (taskId: string, newStatus: boolean) => {
    await api.put(`/tasks/${taskId}`, { isDone: newStatus });
};

export const createTask = async (
    taskListId: string,
    taskData: {
        name: string;
        shortDescription: string;
        longDescription: string;
    }
) => {
    const requestBody = {
        ...taskData,
        taskListId,
    };

    const response = await api.post(`/tasks`, requestBody);
    return response.data;
};
export async function deleteTask(id: string) {
    try {
        await api.delete(`/tasks/${id}`);
        return true;
    } catch (err) {
        console.error("Failed to delete task", err);
        return false;
    }
}


export const updateTask = async (taskId: string, updatedTask: {
    name: string;
    shortDescription: string;
    longDescription: string;
}) => {
    const response = await api.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
};
