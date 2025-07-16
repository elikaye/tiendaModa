import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="search"
      placeholder="Buscar productos..."
      value={query}
      onChange={handleChange}
      className="border border-gray-300 rounded px-3 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
      aria-label="Buscar productos"
    />
  );
}
