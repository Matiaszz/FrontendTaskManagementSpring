'use client';
import { useEffect, useState } from "react";
import { getUser } from "../services/userService";
import { useRouter } from "next/navigation";
import IUser from "@/interfaces/responses";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        try {
            getUser().then((data) => {
                if (!data) {
                    router.push('/login');
                    return;
                }
                setUser(data)
            });

        } catch (error) {
            console.error('Profile failed:', error);
            router.push('/login');
            return;

        } finally {
            setIsLoading(false);
        }


    }, []);

    return (
        <>
            <h1>Profile</h1>
            {user && !isLoading && (
                <p className='text-white'>{user.username}</p>

            )}
        </>
    );
}
export default Profile;