import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const { addTask } = useTasks();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await addTask(title.trim());
            setTitle('');
            setError(null);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    return (
        <div className="">
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add new task..."
                    required
                    className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg border border-blue-600 hover:bg-blue-600 hover:border-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
</svg>

                </button>
            </form>
        </div>
    );
};

export default AddTask;