'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function SearchInput({ value, onChange, inputRef }: SearchInputProps) {
  return (
    <div className="search-wrapper">
      <div className="search-icon-left">
        <Search size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder='Search "AI agents", "startup funding", "SaaS pricing"...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search articles"
      />
      <div className="search-actions-right">
        {value && (
          <button
            onClick={() => onChange('')}
            className="clear-button"
            title="Clear search"
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
        <kbd className="keyboard-badge" title="Press / to focus">
          /
        </kbd>
      </div>
    </div>
  );
}
