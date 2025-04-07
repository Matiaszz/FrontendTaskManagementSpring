'use client';
import { useEffect, useState } from "react";
import { ITaskList } from "@/interfaces/responses";
import { getTaskListByLoggedUser } from "../services/taskListService";
import { getUser } from "../services/userService";
import { deleteTask, toggleTaskStatus } from "../services/taskService";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Edit, Trash2, CheckCircle, Undo, X } from "lucide-react";

const Task = () => {
    const [taskLists, setTaskLists] = useState<ITaskList[] | null>(null);
    const [openTaskListId, setOpenTaskListId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTaskListByLoggedUser = async () => {
            try {
                const user = await getUser();
                if (!user) {
                    router.push('/auth');
                    return;
                }
                const data = await getTaskListByLoggedUser();
                setTaskLists(data);
            } catch (error) {
                console.error("Error fetching task list:", error);
            }
        };
        fetchTaskListByLoggedUser();
    }, [router]);

    const toggleTaskList = (id: string) => {
        setOpenTaskListId(prev => (prev === id ? null : id));
    };

    const handleToggleDone = async (taskId: string, currentStatus: boolean) => {
        await toggleTaskStatus(taskId, !currentStatus);
        const updatedData = await getTaskListByLoggedUser();
        setTaskLists(updatedData);
    };

    const confirmDelete = (taskId: string) => {
        setTaskToDelete(taskId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (taskToDelete) {
            await deleteTask(taskToDelete);
            const updatedData = await getTaskListByLoggedUser();
            setTaskLists(updatedData);
        }
        setShowDeleteModal(false);
        setTaskToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
            <h1 className="text-4xl font-bold text-center mb-10">Your Task Lists</h1>
            <div className="grid gap-6 max-w-4xl mx-auto">
                {taskLists?.map((list) => (
                    <div
                        key={list.id}
                        className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold">{list.title}</h2>
                                <p className="text-gray-400">{list.shortDescription}</p>
                            </div>
                            <button
                                onClick={() => toggleTaskList(list.id)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                {openTaskListId === list.id ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                            </button>
                        </div>

                        {openTaskListId === list.id && (
                            <div className="transition-all space-y-4 mt-4">
                                <p className="text-sm text-gray-500 mb-4">{list.longDescription}</p>
                                {list.tasks.length > 0 ? (
                                    list.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-4 rounded-xl border flex justify-between items-start gap-4 ${task.isDone
                                                ? "bg-green-900/30 border-green-600 text-green-300 line-through"
                                                : "bg-gray-800 border-gray-700"
                                                }`}
                                        >
                                            <div>
                                                <h3 className="text-lg font-medium">{task.name}</h3>
                                                <p className="text-sm text-gray-400">{task.shortDescription}</p>
                                                <p className="text-sm text-gray-500 mt-1">{task.longDescription}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <button className="hover:text-blue-400">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="hover:text-red-500" onClick={() => confirmDelete(task.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="hover:text-green-400" onClick={() => handleToggleDone(task.id, task.isDone)}>
                                                    {task.isDone ? <Undo size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No tasks added yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center w-full max-w-sm border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h2>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this task?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1"
                            >
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
