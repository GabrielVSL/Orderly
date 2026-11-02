import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SearchBar = ({ value, onChange, onClear, placeholder = 'Buscar por smash burger, skinny fries, shake, refrigerante...' }) => {
  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-patties-red">
        <MagnifyingGlassIcon className="h-5 w-5 stroke-[2.5]" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3.5 bg-white border border-neutral-200/80 focus:border-patties-red rounded-2xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none shadow-soft focus:shadow-elevated transition-all text-sm sm:text-base font-bold"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-900 cursor-pointer"
          aria-label="Limpar busca"
        >
          <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
