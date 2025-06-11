import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import Task from './Task';

const CompletedList = () => {
    const { tasks, loading, error, toggleTask, removeTask } = useTasks();
    const completedTasks = tasks.filter(task => task.status);
    const [isOpen, setIsOpen] = useState(false);

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
        <div className="bg-white rounded-lg border border-gray-100">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Completed Tasks</span>
                    {completedTasks.length > 0 && (
                        <span className="text-sm text-gray-400">({completedTasks.length})</span>
                    )}
                </div>
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isOpen && (
                <div className="px-6 pb-6">
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
            )}
        </div>
    );
};

export default CompletedList; 