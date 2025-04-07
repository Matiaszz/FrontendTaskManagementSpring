'use client';
import { useEffect, useState } from "react";
import { ITaskList } from "@/interfaces/responses";
import { getTaskListByLoggedUser } from "../services/taskListService";
import { getUser } from "../services/userService";
import { useRouter } from "next/navigation";

const Task = () => {
    const [taskList, setTaskList] = useState<ITaskList[] | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTaskListByLoggedUser = async () => {
            try {
                const user = await getUser();
                if (user == null) {
                    router.push('/auth');
                    return;
                }
                const data = await getTaskListByLoggedUser();

                setTaskList(data);
            } catch (error) {
                console.error("Error fetching task list:", error);
            }
        };
        fetchTaskListByLoggedUser();
    }, []);

    return (
        <>
            <h1>Tasks</h1>
            {taskList != null ? (
                taskList.map((list) => (
                    <div key={list.id}>
                        <h2>{list.title}</h2>
                        <p>{list.shortDescription}</p>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Task;
