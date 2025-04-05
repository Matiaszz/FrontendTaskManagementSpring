'use client';
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import IUser from '../../interfaces/responses';
import { getUser } from '../services/userService';

const Auth = () => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<string[]>([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getUser().then((data) => {
            if (data) {
                router.push('/profile');
            }
        });
    }, [router]);

    const showToast = (message: string) => {
        setToasts((prev) => [...prev, message]);
        setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 4000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = isLogin ? 'login' : 'register';

            if (!isLogin && password !== confirmPassword) {
                showToast("Password and confirmation must match.");
                setIsLoading(false);
                setPassword('');
                setConfirmPassword('');
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

            router.push('/profile');

        } catch (error: any) {
            showToast(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 text-white relative">

            {/* TOASTS */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                {toasts.map((msg, index) => (
                    <div
                        key={index}
                        className="bg-red-400 text-white border border-red-500 px-5 py-3 rounded-lg text-sm animate-fadeSlide shadow-lg"
                    >
                        {msg}
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 w-full max-w-md p-8 rounded-2xl shadow-xl overflow-hidden relative">
                <h1 className="text-3xl font-semibold text-center mb-6">
                    {isLogin ? "Login" : "Create your account"}
                </h1>

                <div
                    className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${isLogin ? 'h-[220px]' : 'h-[520px]'}`}
                >
                    <div
                        className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}
                    >
                        {/* Login form */}
                        <form
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col justify-center space-y-4 pr-4"
                        >
                            <FormField value={username} field="Username" action={setUsername} />
                            <FormField value={password} field="Password" action={setPassword} type="password" />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        {/* Register form */}
                        <form
                            onSubmit={handleSubmit}
                            className="w-full space-y-4 pl-4 pt-2"
                        >
                            <FormField value={username} field="Username" action={setUsername} />
                            <FormField value={password} field="Password" action={setPassword} type="password" />
                            <FormField value={confirmPassword} field="Confirm password" action={setConfirmPassword} type="password" />
                            <FormField value={name} field="Name" action={setName} />
                            <FormField value={lastName} field="Last name" action={setLastName} />
                            <FormField value={email} field="Email" action={setEmail} type="email" />
                            <FormField value={description} field="Description" action={setDescription} isRequired={false} />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-sm text-center text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 hover:cursor-pointer text-blue-500 hover:underline transition"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
