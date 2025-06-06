import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch tasks');
            setLoading(false);
        }
    };

    const addTask = async (title) => {
        try {
            const newTask = await createTask({ title });
            setTasks(prev => [...prev, newTask]);
        } catch (err) {
            setError(err.message || 'Failed to create task');
            throw err;
        }
    };

    const toggleTask = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            const updatedTask = await updateTask(taskId, { ...task, status: !task.status });
            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        } catch (err) {
            setError(err.message || 'Failed to update task');
            throw err;
        }
    };

    const removeTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            setError(err.message || 'Failed to delete task');
            throw err;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const value = {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        removeTask,
        refreshTasks: fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}; 