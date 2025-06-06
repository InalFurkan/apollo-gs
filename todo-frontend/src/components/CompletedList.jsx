import React from 'react';
import { useTasks } from '../contexts/TaskContext';
import Task from './Task';

const CompletedList = () => {
    const { tasks, loading, error, toggleTask, removeTask } = useTasks();
    const completedTasks = tasks.filter(task => task.status);

    if (loading) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Completed Tasks</h2>
            {completedTasks.length === 0 ? (
                <p className="text-gray-500 italic">No completed tasks</p>
            ) : (
                <div className="space-y-4">
                    {completedTasks.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTask(task.id)}
                            onDelete={() => removeTask(task.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedList; 