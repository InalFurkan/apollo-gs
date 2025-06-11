import React, { useState, useEffect } from 'react';
import { getTags } from '../services/api';
import TagBadge from './TagBadge';
import { useTasks } from '../contexts/TaskContext';

const Header = () => {
  const { searchTerm, setSearchTerm, selectedTags, setSelectedTags } = useTasks();
  const [tags, setTags] = useState([]);

  useEffect(() => {
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

  const handleTagFilter = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className="py-6">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h2>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-4">
          {/* Arama Alanı */}
          <div className="flex-1 max-w-md">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Masaüstü: Etiket Filtreleri */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Assigned as a tag-like filter */}
            <button
              onClick={() => handleTagFilter('assigned')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
                selectedTags.includes('assigned')
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <TagBadge tag={{ name: 'Assigned' }} />
            </button>
            {/* Tag filter buttons */}
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagFilter(tag.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <TagBadge tag={tag} />
              </button>
            ))}
          </div>

          {/* Mobil: Dropdown ile Etiket Filtreleri */}
          <div className="md:hidden flex-shrink-0">
            <details className="relative">
              <summary className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 cursor-pointer select-none w-fit">
                <span className="font-medium text-gray-700">Filter</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                {selectedTags.length > 0 && (
                  <span className="flex flex-wrap gap-1 ml-2">
                    {selectedTags.map(selId => {
                      if(selId === 'assigned') return <TagBadge key="assigned" tag={{ name: 'Assigned' }} />;
                      const tag = tags.find(t => t.id === selId);
                      return tag ? <TagBadge key={tag.id} tag={tag} /> : null;
                    })}
                  </span>
                )}
              </summary>
              <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 p-2 flex flex-col gap-1">
                <label className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes('assigned')}
                    onChange={() => handleTagFilter('assigned')}
                  />
                  <TagBadge tag={{ name: 'Assigned' }} />
                </label>
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagFilter(tag.id)}
                    />
                    <TagBadge tag={tag} />
                  </label>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
