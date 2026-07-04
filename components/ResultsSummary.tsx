'use client';

import React from 'react';
import { Filter, Layers } from 'lucide-react';

interface ResultsSummaryProps {
  count: number;
  searchQuery: string;
  selectedCategory: string;
  selectedTags: string[];
  onClear: () => void;
}

export default function ResultsSummary({
  count,
  searchQuery,
  selectedCategory,
  selectedTags,
  onClear,
}: ResultsSummaryProps) {
  const hasFilters = !!(searchQuery || selectedCategory || selectedTags.length > 0);

  const getSummaryText = () => {
    if (!hasFilters) {
      return `${count} articles available`;
    }

    const conditions: string[] = [];
    if (searchQuery) {
      conditions.push(`"${searchQuery}"`);
    }
    if (selectedCategory) {
      conditions.push(`in ${selectedCategory}`);
    }
    if (selectedTags.length > 0) {
      conditions.push(`tagged ${selectedTags.map((t) => `#${t}`).join(', ')}`);
    }

    return `${count} ${count === 1 ? 'result' : 'results'} for ${conditions.join(' ')}`;
  };

  return (
    <div className="results-summary-bar">
      <div className="results-count">
        {hasFilters ? <Filter size={14} className="text-[var(--accent)]" /> : <Layers size={14} className="text-[var(--text-muted)]" />}
        <span>{getSummaryText()}</span>
      </div>
      {hasFilters && (
        <button
          className="reset-link"
          onClick={onClear}
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
          type="button"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
