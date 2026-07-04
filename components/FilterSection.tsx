'use client';

import React from 'react';

interface FilterSectionProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function FilterSection({
  categories,
  selectedCategory,
  onCategoryChange,
  tags,
  selectedTags,
  onTagToggle,
}: FilterSectionProps) {
  // Let's curate a list of popular tags to display to avoid cluttering the UI
  const popularTagList = [
    'AI agents',
    'automation',
    'SaaS',
    'funding',
    'product strategy',
    'operations',
    'workflow design',
    'search',
    'founder lessons',
    'market shifts',
    'growth',
    'engineering',
  ];

  // Filter tags to only show those that exist in our dataset (or fallback to first 12 if none match)
  const displayTags = tags.filter((tag) => 
    popularTagList.includes(tag.toLowerCase()) || 
    popularTagList.includes(tag)
  ).slice(0, 15);

  return (
    <div className="filters-section container">
      {/* Category Chips (Horizontal Scroll on Mobile) */}
      <div className="categories-container scroll-hide">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onCategoryChange(isActive ? '' : category)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Popular Tags */}
      {displayTags.length > 0 && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <h2 className="tags-section-title">Popular Tags</h2>
          <div className="tags-container">
            {displayTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  className={`tag-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onTagToggle(tag)}
                  type="button"
                >
                  {isActive ? `✓ ${tag}` : tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
