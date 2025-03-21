import { Dispatch, SetStateAction } from "react";
import IUser from "@/interfaces/responses";

export const getUser = async (
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setUser: Dispatch<SetStateAction<IUser | null>>,
    url: string
): Promise<IUser | null> => {
    setIsLoading(true);

    try {
        const res = await fetch(`${url}/auth/user`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            setUser(null);
            return null;
        }

        const data: IUser = await res.json();
        setUser(data);
        return data;

    } catch (error) {
        console.error('Check login failed:', error);
        setUser(null);
        return null;

    } finally {
        setIsLoading(false);
    }
};
