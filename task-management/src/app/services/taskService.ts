import api from "./api";
import { ITask, ITaskUpdateRequest } from "@/interfaces/responses";

export async function toggleTaskStatus(id: string, currentStatus: boolean) {
    try {
        const response = await api.put(`/tasks/${id}`, {
            isDone: !currentStatus,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to toggle task status", err);
        return null;
    }
}

export async function deleteTask(id: string) {
    try {
        await api.delete(`/tasks/${id}`);
        return true;
    } catch (err) {
        console.error("Failed to delete task", err);
        return false;
    }
}

// (Opcional) para edição futura
export async function updateTask(id: string, updatedTask: ITaskUpdateRequest) {
    try {
        const response = await api.put(`/tasks/${id}`, updatedTask);
        return response.data;
    } catch (err) {
        console.error("Failed to update task", err);
        return null;
    }
}
