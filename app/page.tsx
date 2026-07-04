'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import SearchHero from '../components/SearchHero';
import FilterSection from '../components/FilterSection';
import ResultsSummary from '../components/ResultsSummary';
import ResultCard from '../components/ResultCard';
import ArticleModal from '../components/ArticleModal';
import { useArticleSearch } from '../hooks/useArticleSearch';
import { Search } from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    query,
    setQuery,
    debouncedQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    toggleTag,
    results,
    clearAllFilters,
    allCategories,
    allTags,
    totalArticlesCount,
  } = useArticleSearch();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Check if article modal should be open (synced with ?article=slug URL param)
  const activeArticleSlug = searchParams.get('article');
  // Find article from full results list so a user can open it even if they filter afterwards
  const activeArticle = results.find((a) => a.slug === activeArticleSlug) || null;

  // Reset keyboard card focus when search results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [results]);

  // Sync opening and closing article details via URL parameters
  const handleOpenArticle = (slug: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('article', slug);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleCloseArticle = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('article');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Focus search input when '/' is pressed (excluding input/textarea fields)
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // 2. Escape triggers: if modal is not open, Escape can clear the search or blur the field.
      if (e.key === 'Escape' && !activeArticleSlug) {
        if (query) {
          setQuery('');
        } else if (document.activeElement?.tagName === 'INPUT') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      // If results list is empty, list navigation shortcuts do nothing
      if (results.length === 0) return;

      // 3. Arrow Down to navigate search result cards
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev + 1;
          if (next >= results.length) return results.length - 1;
          return next;
        });
      }

      // 4. Arrow Up to navigate search result cards
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev - 1;
          if (next < 0) {
            // Move focus back to search input
            searchInputRef.current?.focus();
            return -1;
          }
          return next;
        });
      }

      // 5. Enter key to open selected card
      if (e.key === 'Enter') {
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          e.preventDefault();
          handleOpenArticle(results[focusedIndex].slug);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [results, focusedIndex, activeArticleSlug, query, setQuery]);

  // Scroll active list card into view when navigated via arrow keys
  useEffect(() => {
    if (focusedIndex === -1) return;
    const cards = document.querySelectorAll('.result-card');
    const selectedCardElement = cards[focusedIndex] as HTMLElement;
    if (selectedCardElement) {
      selectedCardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  return (
    <>
      <Header totalArticlesCount={totalArticlesCount} />
      
      <main className="container" style={{ flex: 1, paddingBottom: 'var(--space-16)' }}>
        <SearchHero value={query} onChange={setQuery} inputRef={searchInputRef} />
        
        <FilterSection
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
        />

        <div className="results-container">
          <ResultsSummary
            count={results.length}
            searchQuery={debouncedQuery}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onClear={clearAllFilters}
          />

          {results.length > 0 ? (
            <div className="results-list">
              {results.map((article, idx) => (
                <ResultCard
                  key={article.id}
                  article={article}
                  searchQuery={debouncedQuery}
                  isKeyboardFocused={idx === focusedIndex}
                  onClick={() => handleOpenArticle(article.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search className="empty-icon" />
              <h3 className="empty-title">No matching articles found</h3>
              <p className="empty-text">
                Try searching for another topic or click one of our recommended keywords below.
              </p>
              <div className="empty-suggestions">
                {['AI agents', 'SaaS', 'funding', 'automation'].map((term) => (
                  <button
                    key={term}
                    className="tag-pill"
                    onClick={() => setQuery(term)}
                    type="button"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Render Article modal if matched slug exists in URL search params */}
      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={handleCloseArticle} />
      )}
    </>
  );
}

// Next.js App Router requirements: Wrap the useSearchParams hook inside a Suspense boundary
// This prevents build-time errors and enables static optimization.
export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
            Preparing search index...
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </React.Suspense>
  );
}
