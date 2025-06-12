import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import Task from './Task';

// You can change this value to set how many tasks per page
const PAGE_SIZE = 5;

const TodoList = () => {
    const { filteredTasks, loading, error, toggleTask, removeTask, searchTerm } = useTasks();
    const activeTasks = filteredTasks.filter(task => !task.status);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(activeTasks.length / PAGE_SIZE);
    const paginatedTasks = activeTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Reset to first page when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filteredTasks.length]);

    // Handlers
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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
                <>
                <div className="space-y-4">
                    {paginatedTasks.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTask(task.id)}
                            onDelete={() => removeTask(task.id)}
                        />
                    ))}
                </div>
                {/* Pagination Bar */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 select-none">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-200 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => goToPage(idx + 1)}
                                className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-200 ${currentPage === idx + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-200 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default TodoList;