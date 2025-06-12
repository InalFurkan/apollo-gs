import React, { useState, useRef, useEffect } from 'react';
import { searchUsers, assignUsersToTask } from '../services/api';

const Task = ({ task, onToggle, onDelete }) => {
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(task.assignedUsers || []);
    const [expanded, setExpanded] = useState(false);
    const [assignSuccess, setAssignSuccess] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
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

    // Input değiştiğinde otomatik arama (gerçek API)
    useEffect(() => {
        let active = true;
        if (searchEmail) {
            searchUsers(searchEmail).then(users => {
                if (active) setSearchResults(users);
            }).catch(() => {
                if (active) setSearchResults([]);
            });
        } else {
            setSearchResults([]);
        }
        return () => { active = false; };
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

    const handleAssign = async () => {
        setAssignLoading(true);
        try {
            await assignUsersToTask(task.id, selectedUsers.map(u => u.id));
            setAssignSuccess(true);
            setTimeout(() => setAssignSuccess(false), 1500);
            setIsAssignOpen(false);
        } catch (e) {
            // Optionally show error
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <div
            className={`group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-all duration-200 relative ${expanded ? 'min-h-[90px]' : ''}`}
            style={{ cursor: task.description ? 'pointer' : 'default' }}
        >
            {/* Main content area (title, tags, etc.) - toggles expand on click */}
            <div className="flex items-center gap-3 flex-1 min-w-0" onClick={task.description ? () => setExpanded((prev) => !prev) : undefined} style={{ cursor: task.description ? 'pointer' : 'default' }}>
                <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={task.status}
                        onChange={onToggle}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <span
                        className={`text-sm truncate ${task.status ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                        title={task.description ? 'Click to expand/collapse description' : ''}
                    >
                        {task.title}
                    </span>
                    {/* Show description if expanded */}
                    {task.description && expanded && (
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm whitespace-pre-line">
                            {task.description}
                        </div>
                    )}
                    {/* Show tags if present */}
                    {Array.isArray(task.tags) && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {task.tags.map(tag => (
                                <span key={tag.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Show assigned users */}
                    {Array.isArray(selectedUsers) && selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUsers.map(user => (
                                <span key={user.id} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                    {user.email}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="text-xs text-gray-400">
                        {formatDate(task.created_at)}
                    </span>
                </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-1 ml-2 z-10" onClick={e => e.stopPropagation()}>
                {/* Assign icon */}
                <button
                    onClick={() => setIsAssignOpen(!isAssignOpen)}
                    className="p-1 text-blue-500 hover:text-blue-700 focus:outline-none bg-transparent border-none shadow-none outline-none"
                    title="Assign"
                    type="button"
                    style={{ border: 'none', background: 'none', boxShadow: 'none' }}
                >
                    {/* Chain icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.07 7.07a4 4 0 010-5.656m3.656 3.656a4 4 0 01-5.656 0" />
                    </svg>
                </button>
                {/* Delete icon */}
                <button
                    onClick={onDelete}
                    className="p-1 text-red-400 hover:text-red-600 focus:outline-none bg-transparent border-none shadow-none outline-none"
                    aria-label="Delete task"
                    type="button"
                    style={{ border: 'none', background: 'none', boxShadow: 'none' }}
                >
                    {/* Trash icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            {/* Arrow always at far right, only toggles expand/collapse */}
            {task.description && (
                <button
                    onClick={e => { e.stopPropagation(); setExpanded((prev) => !prev); }}
                    className="p-1 text-gray-400 hover:text-gray-700 focus:outline-none transition-transform bg-transparent border-none shadow-none outline-none ml-2"
                    aria-label="Expand/collapse description"
                    type="button"
                    style={{ border: 'none', background: 'none', boxShadow: 'none', marginLeft: 'auto' }}
                >
                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
            {/* Assign dropdown (real search/assign) */}
            {isAssignOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-10">
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
                                onClick={handleAssign}
                                disabled={selectedUsers.length === 0 || assignLoading}
                                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    selectedUsers.length > 0 && !assignLoading
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {assignLoading ? 'Assigning...' : `Assign${selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ''}`}
                            </button>
                            {assignSuccess && (
                                <div className="text-green-600 text-xs mt-2">Assigned successfully!</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
