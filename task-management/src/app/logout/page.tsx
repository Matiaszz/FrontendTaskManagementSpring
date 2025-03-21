'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


const Logout = () => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${url}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!res.ok) {
                console.error(
                    'Logout failed (Probably user is not authenticated): ',
                    res.text()
                );
                router.push('/login');
                return;
            }

            router.push('/login');

        } catch (error) {
            console.error('Logout failed:', error);

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleLogout();
    }, []);


    return (
        <>
            {isLoading && <p>Logging out...</p>}
        </>
    )
}
export default Logout;