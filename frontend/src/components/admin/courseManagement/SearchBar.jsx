// SearchBar.js
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, colors }) => {
  return (
    <div className="flex items-center">
      <div className={`flex items-center py-2 px-4 rounded-lg ${colors.card}`}>
        <Search className={`mr-2 h-5 w-5 ${colors.icon}`} />
        <input
          type="text"
          placeholder="Search courses..."
          className={`bg-transparent outline-none ${colors.text} w-full`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;