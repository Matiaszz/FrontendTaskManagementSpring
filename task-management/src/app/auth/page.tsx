'use client';
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import IUser from '../../interfaces/responses';
import { getUser } from '../services/userService';

const Login = () => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const [user, setUser] = useState<IUser | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");

    // 🔁 Check if user is already authenticated
    useEffect(() => {
        getUser().then((data) => {
            if (data) {
                setUser(data);
                router.push('/profile');
            }
        });
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);

        try {
            const endpoint = isLogin ? 'login' : 'register';

            if (!isLogin && password !== confirmPassword) {
                setErrors(["Password and confirmation must match."]);
                setIsLoading(false);
                return;
            }

            const requestBody = isLogin
                ? { username, password }
                : { username, password, name, lastName, email, description };

            const res = await fetch(`${url}/auth/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `${isLogin ? 'Login' : 'Registration'} failed`);
            }

            const data: IUser = await res.json();
            setUser(data);
            router.push('/profile');

        } catch (error: any) {
            setErrors([error.message]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>{isLogin ? "Login" : "Register"}</h1>

            {errors.length > 0 && (
                <div style={{ color: "red" }}>
                    {errors.map((err, index) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}

            {!user && (
                <form onSubmit={handleSubmit}>
                    <FormField field="Username" action={setUsername} />
                    <FormField field="Password" action={setPassword} type="password" />

                    {!isLogin && (
                        <>
                            <FormField field="Password confimation" action={setConfirmPassword} type="password" />
                            <FormField field="Name" action={setName} />
                            <FormField field="Last name" action={setLastName} />
                            <FormField field="Email" action={setEmail} type="email" />
                            <FormField field="Description" action={setDescription} />
                        </>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
                    </button>
                </form>
            )}

            <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? " Register" : " Login"}
                </button>
            </p>
        </div>
    );
};

export default Login;
