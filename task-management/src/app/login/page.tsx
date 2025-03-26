'use client';
import { useState, useEffect, FormEvent } from "react";
import IUser from '../../interfaces/responses';
import { getUser } from '../services/userService';
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';

const Login = () => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        getUser().then((data) => {
            if (data) {
                setUser(data);
                router.push('/profile');
            }
        });
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (user) return;

        setIsLoading(true);

        try {
            const res = await fetch(`${url}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data: IUser = await res.json();
            setUser(data);
            router.push('/profile');

        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <h1>Login</h1>
            {!user && (
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            )}

            {user && <p>{user.name}</p>}
        </>
    );
};

export default Login;
