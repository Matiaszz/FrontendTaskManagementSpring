import IUser from "@/interfaces/responses";

export const getUser = async (): Promise<IUser | null> => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {

        const res = await fetch(`${url}/auth/user`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) return null;

        const data: IUser = await res.json();
        return data;

    } catch (error) {
        console.error('Check login failed:', error);
        return null;
    }
};
