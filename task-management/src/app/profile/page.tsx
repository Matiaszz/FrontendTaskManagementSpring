'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser } from "../services/userService";
import IUser from "@/interfaces/responses";

interface FormData {
    name: string;
    lastName: string;
    email: string;
    description: string;
    profileImageURL: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        lastName: "",
        email: "",
        description: "",
        profileImageURL: ""
    });

    const [editMode, setEditMode] = useState({
        name: false,
        lastName: false,
        email: false,
        description: false,
        profileImageURL: false,
    });

    useEffect(() => {
        getUser().then((data) => {
            if (!data) {
                router.push("/auth");
                return;
            }
            setUser(data);
            setLoading(false);
        });
    }, [router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                lastName: user.lastName || "",
                email: user.email || "",
                description: user.description || "",
                profileImageURL: user.profileImageURL || ""
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUpdating(true);
        const result = await updateUser(formData);
        setUpdating(false);

        if (result) {
            setUser(result);
            setMessage("Profile updated successfully.");
            return;
        }
        setMessage("Failed to update profile.");

    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    const renderField = (
        label: string,
        name: keyof FormData,
        isTextarea = false
    ) => {
        return (
            <div>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <div className="flex items-start gap-2">
                    {editMode[name] ? (
                        isTextarea ? (
                            <textarea
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full bg-gray-800 rounded px-4 py-2 outline-none whitespace-pre-wrap resize-y overflow-y-auto max-h-48 min-w-full overflow-x-visible break-all"
                            />
                        ) : (
                            <input
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-auto bg-gray-800 rounded px-4 py-2 outline-none min-w-full overflow-x-visible"
                            />
                        )
                    ) : (
                        <div className="w-full bg-gray-800 rounded px-4 py-2 overflow-x-auto whitespace-nowrap">
                            {formData[name] || "N/A"}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => toggleEdit(name)}
                        className="text-sm cursor-pointer text-blue-500 hover:underline whitespace-nowrap"
                    >
                        {editMode[name] ? "Cancel" : "Edit"}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 text-white">
            <div className="bg-gray-900 w-full max-w-xl p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-6 overflow-x-visible">
                <img
                    src={formData.profileImageURL || "default.png"}
                    alt={`${user.username} profile`}
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow-md"
                />

                <h1 className="text-2xl font-bold">{formData.name} {formData.lastName}</h1>
                <p className="text-gray-400">@{user.username}</p>

                <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4 overflow-x-visible">
                    {renderField("Name", "name")}
                    {renderField("Last Name", "lastName")}
                    {renderField("Email", "email")}
                    {renderField("Description", "description", true)}
                    {renderField("Profile Image URL", "profileImageURL")}

                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2 rounded text-white font-semibold w-full"
                    >
                        {updating ? "Updating..." : "Update Profile"}
                    </button>

                    {message && <p className="text-center text-sm mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
