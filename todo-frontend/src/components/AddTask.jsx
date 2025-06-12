import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { getTags } from '../services/api';
import TagBadge from './TagBadge';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { addTask } = useTasks();

    useEffect(() => {
        // Only fetch tags if user is authenticated (token exists)
        if (!localStorage.getItem('token')) return;
        const fetchTags = async () => {
            try {
                const tagList = await getTags();
                setTags(Array.isArray(tagList) ? tagList : []);
            } catch (err) {
                setTags([]);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            // Sadece sayısal tag id'lerini gönder
            const onlyTagIds = selectedTags.filter(id => typeof id === 'number' || !isNaN(Number(id))).map(Number);
            await addTask({ title: title.trim(), description: description.trim(), tags: onlyTagIds });
            setTitle('');
            setDescription('');
            setSelectedTags([]);
            setError(null);
        } catch (err) {
            setError(err?.message || 'Failed to create task');
        }
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <div className="">
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add new task..."
                    required
                    className="flex-1 px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="flex-1 px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[40px] max-h-32"
                />
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((open) => !open)}
                        className="px-2 py-2 border border-gray-300 rounded-lg min-w-[120px] max-w-[200px] bg-white flex items-center gap-2"
                    >
                        {selectedTags.length === 0 ? (
                            <span className="text-gray-400 text-xs">Etiket seç...</span>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {tags.filter(tag => selectedTags.includes(String(tag.id))).map(tag => (
                                    <TagBadge key={tag.id} tag={tag} />
                                ))}
                            </div>
                        )}
                        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                            {tags.length === 0 ? (
                                <div className="p-2 text-xs text-gray-400">Etiket yok</div>
                            ) : (
                                tags.map(tag => (
                                    <label key={tag.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(String(tag.id))}
                                            onChange={() => handleTagToggle(String(tag.id))}
                                            className="accent-blue-500"
                                        />
                                        <TagBadge tag={tag} />
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg border border-blue-600 hover:bg-blue-600 hover:border-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default AddTask;