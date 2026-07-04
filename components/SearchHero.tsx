'use client';

import React from 'react';
import SearchInput from './SearchInput';

interface SearchHeroProps {
  value: string;
  onChange: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function SearchHero({ value, onChange, inputRef }: SearchHeroProps) {
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
      </div>
    </section>
  );
}
