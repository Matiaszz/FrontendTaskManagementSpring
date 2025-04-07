import { IUser } from "@/interfaces/responses";
import api from "./api";

export async function getUser(): Promise<IUser | null> {
    try {
        const response = await api.get("/auth/user");
        return response.data;


    } catch (err) {
        return null;
    }
}

export async function updateUser(data: Partial<IUser>): Promise<IUser | null> {
    try {
        const response = await api.put("/user", data, { withCredentials: true });
        return response.data;

    } catch (err) {
        console.error("Failed to update user", err);
        return null;
    }
}