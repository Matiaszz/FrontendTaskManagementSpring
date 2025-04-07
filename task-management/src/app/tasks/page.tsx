'use client';
import { useEffect, useState } from "react";
import { ITaskList } from "@/interfaces/responses";
import { getTaskListByLoggedUser, createTaskList, deleteTaskList, updateTaskList } from "../services/taskListService";
import { getUser } from "../services/userService";
import { createTask, deleteTask, toggleTaskStatus, updateTask } from "../services/taskService";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Edit, Trash2, CheckCircle, Undo, X, PlusCircle, FolderPlus } from "lucide-react";

const Task = () => {
    const [taskLists, setTaskLists] = useState<ITaskList[] | null>(null);
    const [openTaskListId, setOpenTaskListId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({ name: "", shortDescription: "", longDescription: "" });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTaskForm, setNewTaskForm] = useState({ name: "", shortDescription: "", longDescription: "", taskListId: "" });
    const [showAddListModal, setShowAddListModal] = useState(false);
    const [newListForm, setNewListForm] = useState({ title: "", shortDescription: "", longDescription: "" });

    const [taskListToEdit, setTaskListToEdit] = useState<ITaskList | null>(null);
    const [editTaskListForm, setEditTaskListForm] = useState({ title: "", shortDescription: "", longDescription: "" });

    const [taskListToDelete, setTaskListToDelete] = useState<string | null>(null);
    const [showTaskListDeleteModal, setShowTaskListDeleteModal] = useState(false);

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

    const openEditModal = (task: any) => {
        setTaskToEdit(task);
        setEditForm({
            name: task.name,
            shortDescription: task.shortDescription,
            longDescription: task.longDescription
        });
    };

    const handleEditSubmit = async () => {
        if (taskToEdit) {
            await updateTask(taskToEdit.id, editForm);
            const updatedData = await getTaskListByLoggedUser();
            setTaskLists(updatedData);
            setTaskToEdit(null);
        }
    };

    const openAddModal = (taskListId: string) => {
        setNewTaskForm({ name: "", shortDescription: "", longDescription: "", taskListId });
        setShowAddModal(true);
    };

    const handleAddSubmit = async () => {
        const { taskListId, ...taskData } = newTaskForm;
        await createTask(taskListId, taskData);
        const updatedData = await getTaskListByLoggedUser();
        setTaskLists(updatedData);
        setShowAddModal(false);
    };

    const handleAddListSubmit = async () => {
        await createTaskList(newListForm);
        const updatedData = await getTaskListByLoggedUser();
        setTaskLists(updatedData);
        setShowAddListModal(false);
        setNewListForm({ title: "", shortDescription: "", longDescription: "" });
    };

    const openEditTaskListModal = (list: ITaskList) => {
        setTaskListToEdit(list);
        setEditTaskListForm({
            title: list.title,
            shortDescription: list.shortDescription,
            longDescription: list.longDescription,
        });
    };

    const handleEditTaskListSubmit = async () => {
        if (taskListToEdit) {
            await updateTaskList(taskListToEdit.id, editTaskListForm);
            const updatedData = await getTaskListByLoggedUser();
            setTaskLists(updatedData);
            setTaskListToEdit(null);
        }
    };

    const confirmDeleteTaskList = (taskListId: string) => {
        setTaskListToDelete(taskListId);
        setShowTaskListDeleteModal(true);
    };

    const handleDeleteTaskList = async () => {
        if (taskListToDelete) {
            await deleteTaskList(taskListToDelete);
            const updatedData = await getTaskListByLoggedUser();
            setTaskLists(updatedData);
        }
        setTaskListToDelete(null);
        setShowTaskListDeleteModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
            <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center">Your Task Lists</h1>
                <button onClick={() => setShowAddListModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white text-sm">
                    <FolderPlus size={20} /> New Task List
                </button>
            </div>
            <div className="grid gap-6 max-w-4xl mx-auto">
                {taskLists?.map((list) => (
                    <div key={list.id} className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold">{list.title}</h2>
                                <p className="text-gray-400">{list.shortDescription}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditTaskListModal(list)} className="hover:text-blue-400" title="Edit List">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => confirmDeleteTaskList(list.id)} className="hover:text-red-500" title="Delete List">
                                    <Trash2 size={20} />
                                </button>
                                <button onClick={() => openAddModal(list.id)} className="text-green-500 hover:text-green-300" title="Add Task">
                                    <PlusCircle size={20} />
                                </button>
                                <button onClick={() => toggleTaskList(list.id)} className="text-gray-400 hover:text-white">
                                    {openTaskListId === list.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </button>
                            </div>
                        </div>
                        {openTaskListId === list.id && (
                            <div className="transition-all space-y-4 mt-4">
                                <p className="text-sm text-gray-500 mb-4">{list.longDescription}</p>
                                {list.tasks.length > 0 ? (
                                    list.tasks.map((task) => (
                                        <div key={task.id} className={`p-4 rounded-xl border flex justify-between items-start gap-4 ${task.isDone ? "bg-green-900/30 border-green-600 text-green-300 line-through" : "bg-gray-800 border-gray-700"}`}>
                                            <div>
                                                <h3 className="text-lg font-medium">{task.name}</h3>
                                                <p className="text-sm text-gray-400">{task.shortDescription}</p>
                                                <p className="text-sm text-gray-500 mt-1">{task.longDescription}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <button onClick={() => openEditModal(task)} className="hover:text-blue-400"><Edit size={18} /></button>
                                                <button onClick={() => confirmDelete(task.id)} className="hover:text-red-500"><Trash2 size={18} /></button>
                                                <button onClick={() => handleToggleDone(task.id, task.isDone)} className="hover:text-green-400">
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

            {/* Edit Task Modal */}
            {taskToEdit && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700 text-white">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <input className="w-full p-2 mb-3 rounded bg-gray-700 text-white" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        <input className="w-full p-2 mb-3 rounded bg-gray-700 text-white" placeholder="Short Description" value={editForm.shortDescription} onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })} />
                        <textarea className="w-full p-2 mb-4 rounded bg-gray-700 text-white" placeholder="Long Description" value={editForm.longDescription} onChange={(e) => setEditForm({ ...editForm, longDescription: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setTaskToEdit(null)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl">Cancel</button>
                            <button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Task Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center w-full max-w-sm border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h2>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this task?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium">Delete</button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task List Modal */}
            {taskListToEdit && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700 text-white">
                        <h2 className="text-xl font-semibold mb-4">Edit Task List</h2>
                        <input className="w-full p-2 mb-3 rounded bg-gray-700 text-white" placeholder="Title" value={editTaskListForm.title} onChange={(e) => setEditTaskListForm({ ...editTaskListForm, title: e.target.value })} />
                        <input className="w-full p-2 mb-3 rounded bg-gray-700 text-white" placeholder="Short Description" value={editTaskListForm.shortDescription} onChange={(e) => setEditTaskListForm({ ...editTaskListForm, shortDescription: e.target.value })} />
                        <textarea className="w-full p-2 mb-4 rounded bg-gray-700 text-white" placeholder="Long Description" value={editTaskListForm.longDescription} onChange={(e) => setEditTaskListForm({ ...editTaskListForm, longDescription: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setTaskListToEdit(null)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl">Cancel</button>
                            <button onClick={handleEditTaskListSubmit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Task List Modal */}
            {showTaskListDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center w-full max-w-sm border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h2>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this task list?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDeleteTaskList} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium">Delete</button>
                            <button onClick={() => setShowTaskListDeleteModal(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1">
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