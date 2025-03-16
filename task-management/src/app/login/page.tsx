'use client';
import { useState } from "react";
import LoginResponse from '../../interfaces/responses';


const Login = () => {
    const [response, setResponse] = useState<LoginResponse | null>(null);
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
                throw new Error(errorData.message || 'Login failed');
            }

            const data: LoginResponse = await res.json();
            setResponse(data);
            return data;

        } catch (error) {
            console.error('Login failed:', error);
            setResponse(null);
            return null;

        } finally {
            setIsLoading(false);
        }
    }

    console.log('Login page rendered');

    return (
        <>
            <h1>Login</h1>
            <button onClick={() => handleLogin('matias10', '123')} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {response && <p>{response.user.name}</p>}
        </>
    );
}

export default Login;
