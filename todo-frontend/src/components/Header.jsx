import React, { useState } from 'react';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    assigned: false
  });

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className="py-6">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h2>
        
        <div className="flex items-center gap-4">
          {/* Arama Alanı */}
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            
          </div>

          {/* Filtreler */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFilter('assigned')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                filters.assigned
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Assigned
            </button>
            {/* Diğer filtreler buraya eklenebilir */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
