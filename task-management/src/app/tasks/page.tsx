'use client';
import { useEffect, useState } from "react";
import { ITaskList } from "@/interfaces/responses";
import { getTaskListByLoggedUser } from "../services/taskListService";
import { getUser } from "../services/userService";
import { toggleIsDone } from "../services/taskService"; // ✅ import
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Edit, Trash2, CheckCircle, Undo } from "lucide-react";

const Task = () => {
    const [taskLists, setTaskLists] = useState<ITaskList[] | null>(null);
    const [openTaskListId, setOpenTaskListId] = useState<string | null>(null);
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
    const handleToggleTask = async (listId: string, taskId: string, currentStatus: boolean) => {
        const updatedTask = await toggleIsDone(taskId, currentStatus);
        if (!updatedTask) return;

        setTaskLists(prev => {
            if (!prev) return prev;

            return prev.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === taskId ? updatedTask : task
                        )
                    }
                    : list
            );
        });
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
                                                <button className="hover:text-red-500">
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleTask(list.id, task.id, task.isDone)
                                                    }
                                                    className="hover:text-green-400"
                                                >
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
        </div>
    );
};

export default Task;
