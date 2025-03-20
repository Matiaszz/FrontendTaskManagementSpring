'use client';
import { useState, useEffect } from "react";
import IUser from '../../interfaces/responses';


const Login = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkLogin = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${url}/auth/user`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
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
    useEffect(() => {
        checkLogin();
    }, []);

    const handleLogin = async (usernameValue: string, passwordValue: string) => {

        if (user) return user;

        setIsLoading(true);

        try {
            const res = await fetch(`${url}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue
                })
            });



            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data: IUser = await res.json();
            setUser(data);
            checkLogin();
            return data;

        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);
            return null;

        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <h1>Login</h1>
            {!user && (
                <div>
                    <button onClick={() => handleLogin('matias10', '123')} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            )}

            {user && <p>{user.name}</p>}
        </>
    );
}

export default Login;
