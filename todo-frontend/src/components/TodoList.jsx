import React from 'react';
import { useTasks } from '../contexts/TaskContext';
import Task from './Task';

const TodoList = () => {
    const { filteredTasks, loading, error, toggleTask, removeTask } = useTasks();
    const activeTasks = filteredTasks.filter(task => !task.status);

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
        <div className=""> 
            {activeTasks.length === 0 ? (
                <p className="text-gray-500 italic">No tasks yet</p>
            ) : (
                <div className="space-y-4">
                    {activeTasks.map(task => (
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

export default TodoList;