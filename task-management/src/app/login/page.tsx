'use client';
import { useState } from "react";

interface LoginResponse {
    token?: string;
    user?: {
        id: string;
        username: string;
    };
    error?: string;
}

const Login = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (usernameValue: string, passwordValue: string) => {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        setIsLoading(true);

        try {
            const res = await fetch(`${url}/auth/login`, {
                method: 'POST',
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
                throw new Error(errorData.error || 'Login failed');
            }

            const data: LoginResponse = await res.json();
            setResponse(JSON.stringify(data));
            return data;

        } catch (error) {
            console.error('Login failed:', error);
            setResponse(error instanceof Error ? error.message : 'Error during login');
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={() => handleLogin('matias10', '123')} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {response && <p>{response}</p>}
        </div>
    );
}

export default Login;