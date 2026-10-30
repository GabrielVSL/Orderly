import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SearchBar = ({ value, onChange, onClear, placeholder = 'Buscar por smash burger, batata, shake...' }) => {
  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <MagnifyingGlassIcon className="h-5 w-5 text-brand-red" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-yellow-200 rounded-full text-brand-dark placeholder-gray-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red shadow-sm transition-all text-sm sm:text-base font-medium"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700"
          aria-label="Limpar busca"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
