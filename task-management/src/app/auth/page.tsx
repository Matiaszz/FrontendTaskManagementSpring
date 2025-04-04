'use client';
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import IUser from '../../interfaces/responses';
import { getUser } from '../services/userService';

const Auth = () => {
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
        <div className="min-h-screen flex items-center justify-center px-4 text-white">
            <div className="bg-gray-900 w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-300 ease-in-out overflow-hidden relative">
                <h1 className="text-3xl font-semibold text-center mb-6">
                    {isLogin ? "Login" : "Create your account"}
                </h1>

                {errors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {errors.map((err, index) => (
                            <p key={index}>{err}</p>
                        ))}
                    </div>
                )}

                <div className="relative w-full overflow-hidden transition-all duration-500 ease-in-out"
                    style={{ height: isLogin ? '220px' : '520px' }}>
                    <div
                        className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col justify-center space-y-4 pr-4"
                        >
                            <FormField value={username} field="Username" action={setUsername} />
                            <FormField value={password} field="Password" action={setPassword} type="password" />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <form onSubmit={handleSubmit} className="w-full space-y-4 pl-4 pt-2">
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
                                className="w-full hover:cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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
