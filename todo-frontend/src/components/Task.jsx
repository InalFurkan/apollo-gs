import React from 'react';

const Task = ({ task, onToggle, onDelete }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.status}
                    onChange={onToggle}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex flex-col">
                    <span className={`text-sm font-medium text-gray-900 ${task.status ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDate(task.created_at)}
                    </span>
                </div>
            </div>
            <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 hover:border hover:border-red-500 transition-colors duration-200"
                aria-label="Delete task"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default Task;
