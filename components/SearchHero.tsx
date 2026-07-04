'use client';

import React from 'react';
import SearchInput from './SearchInput';
import { Sparkles, Search } from 'lucide-react';

interface SearchHeroProps {
  value: string;
  onChange: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchMode: 'keyword' | 'semantic';
  onSearchModeChange: (mode: 'keyword' | 'semantic') => void;
}

export default function SearchHero({
  value,
  onChange,
  inputRef,
  searchMode,
  onSearchModeChange,
}: SearchHeroProps) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <h1 className="hero-title">
          Search the signal behind tech, AI, startups, and market moves.
        </h1>
        <p className="hero-description">
          Instantly explore 100 mock research articles by title, description, category, tags, and content.
        </p>
        
        <SearchInput value={value} onChange={onChange} inputRef={inputRef} />

        <div className="search-mode-container">
          <div className="search-mode-toggle" role="tablist" aria-label="Search Mode Selection">
            <div className={`search-mode-slider ${searchMode === 'semantic' ? 'semantic-active' : ''}`} />
            
            <button
              type="button"
              role="tab"
              aria-selected={searchMode === 'keyword'}
              className={`search-mode-btn ${searchMode === 'keyword' ? 'active' : ''}`}
              onClick={() => onSearchModeChange('keyword')}
            >
              <Search size={14} />
              Keyword Search
            </button>
            
            <button
              type="button"
              role="tab"
              aria-selected={searchMode === 'semantic'}
              className={`search-mode-btn ${searchMode === 'semantic' ? 'active' : ''}`}
              onClick={() => onSearchModeChange('semantic')}
            >
              <Sparkles size={14} />
              Semantic Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

