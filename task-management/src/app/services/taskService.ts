import api from "./api";
import { ITask } from "@/interfaces/responses";

export async function toggleIsDone(id: string, currentStatus: boolean): Promise<ITask | null> {
    try {
        const response = await api.put(`/tasks/${id}`, {
            isDone: !currentStatus,
        });

        return response.data;
    } catch (err) {
        console.error('Failed to update task', err);
        return null;
    }
}
