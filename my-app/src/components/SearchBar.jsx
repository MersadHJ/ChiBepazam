import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    const results = await onSearch(query); // Call onSearch with the query
    console.log(results); // Optional: Log results for debugging
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for recipes..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;