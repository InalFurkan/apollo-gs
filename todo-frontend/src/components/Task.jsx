import React, { useState, useRef, useEffect } from 'react';

const Task = ({ task, onToggle, onDelete }) => {
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const dropdownRef = useRef(null);

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

    // Dropdown dışına tıklandığında kapanması için
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAssignOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Input değiştiğinde otomatik arama
    useEffect(() => {
        if (searchEmail) {
            // Burada API'den kullanıcı araması yapılacak
            // Şimdilik örnek veri
            setSearchResults([
                { id: 1, email: 'user1@example.com', name: 'User One' },
                { id: 2, email: 'user2@example.com', name: 'User Two' },
                { id: 3, email: 'user3@example.com', name: 'User Three' }
            ]);
        } else {
            setSearchResults([]);
        }
    }, [searchEmail]);

    const handleUserSelect = (user) => {
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    const clearSearch = () => {
        setSearchEmail('');
        setSearchResults([]);
    };

    return (
        <div className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={task.status}
                        onChange={onToggle}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className={`text-sm truncate ${task.status ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.title}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatDate(task.created_at)}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsAssignOpen(!isAssignOpen)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-800 px-2.5 py-1.5 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200"
                    >
                        Assign
                    </button>
                    
                    {isAssignOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-10">
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="search"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                        placeholder="Search user..."
                                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {searchEmail && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Arama sonuçları */}
                                {searchResults.length > 0 && (
                                    <div className="max-h-40 overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleUserSelect(user)}
                                                className={`p-2 text-sm cursor-pointer rounded-md transition-colors duration-200 ${
                                                    selectedUsers.some(u => u.id === user.id)
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                                                        selectedUsers.some(u => u.id === user.id)
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {selectedUsers.some(u => u.id === user.id) && (
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Seçili kullanıcılar */}
                                {selectedUsers.length > 0 && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <h4 className="text-xs font-medium text-gray-500 mb-2">Selected users:</h4>
                                        <div className="space-y-1">
                                            {selectedUsers.map((user) => (
                                                <div key={user.id} className="text-sm text-gray-600 flex items-center justify-between">
                                                    <span>{user.name}</span>
                                                    <button
                                                        onClick={() => handleUserSelect(user)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            // Assign fonksiyonu buraya gelecek
                                            setIsAssignOpen(false);
                                        }}
                                        disabled={selectedUsers.length === 0}
                                        className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            selectedUsers.length > 0
                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Assign {selectedUsers.length > 0 && `(${selectedUsers.length})`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <button
                    onClick={onDelete}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-50 transition-all duration-200"
                    aria-label="Delete task"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Task;
