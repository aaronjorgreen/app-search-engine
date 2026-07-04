'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MiniSearch from 'minisearch';
import articlesData from '../public/mock-articles.json';

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  content: string;
  similarityScore?: number; // Optional similarity match score from semantic search
}

// Convert JSON import to typed array
const articles = articlesData as Article[];

// Extract all unique categories and tags for filtering UI
const allCategories = Array.from(new Set(articles.map((a) => a.category))).sort();
const allTags = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();

// Initialize MiniSearch outside the hook to keep it singleton
const miniSearch = new MiniSearch<Article>({
  fields: ['title', 'tags', 'description', 'category', 'content'], // fields to index
  storeFields: ['id', 'title', 'slug', 'description', 'category', 'tags', 'author', 'date', 'readTime', 'content'], // fields to return
  searchOptions: {
    boost: { title: 3.0, tags: 2.0, description: 1.5 },
    prefix: true,
    fuzzy: 0.2,
  },
});

// Index all articles
miniSearch.addAll(articles);

export function useArticleSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current URL state
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const tagsParam = searchParams.get('tags');
  const modeParam = (searchParams.get('mode') as 'keyword' | 'semantic') || 'keyword';

  const selectedTags = useMemo(() => {
    return tagsParam ? tagsParam.split(',').filter((t) => t.length > 0) : [];
  }, [tagsParam]);

  // Local state for immediate input value (prevents typing lag)
  const [localQuery, setLocalQuery] = useState(qParam);
  const [searchMode, setSearchModeState] = useState<'keyword' | 'semantic'>(modeParam);
  const [isLoading, setIsLoading] = useState(false);
  const [semanticResults, setSemanticResults] = useState<Article[]>([]);

  // Sync local query if URL parameter changes (e.g. back navigation or reset)
  useEffect(() => {
    setLocalQuery(qParam);
  }, [qParam]);

  // Sync searchMode if URL parameter changes
  useEffect(() => {
    setSearchModeState(modeParam);
  }, [modeParam]);

  // Debounced URL updates for query param
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (localQuery) {
        params.set('q', localQuery);
      } else {
        params.delete('q');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [localQuery, router]);

  // Update category instantly in URL
  const setCategory = useCallback((category: string) => {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  // Toggle tag instantly in URL
  const toggleTag = useCallback((tag: string) => {
    const params = new URLSearchParams(window.location.search);
    const currentTags = params.get('tags') ? params.get('tags')!.split(',') : [];
    
    let nextTags: string[];
    if (currentTags.includes(tag)) {
      nextTags = currentTags.filter((t) => t !== tag);
    } else {
      nextTags = [...currentTags, tag];
    }

    if (nextTags.length > 0) {
      params.set('tags', nextTags.join(','));
    } else {
      params.delete('tags');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  // Update search mode instantly in URL
  const setSearchMode = useCallback((mode: 'keyword' | 'semantic') => {
    const params = new URLSearchParams(window.location.search);
    if (mode === 'semantic') {
      params.set('mode', 'semantic');
    } else {
      params.delete('mode');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  // Reset all filters and search input
  const clearAllFilters = useCallback(() => {
    setLocalQuery('');
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    // Clear everything except search mode
    const newParams = new URLSearchParams();
    if (mode) {
      newParams.set('mode', mode);
    }
    router.replace(newParams.toString() ? `?${newParams.toString()}` : '?', { scroll: false });
  }, [router]);

  // Fetch semantic search results asynchronously when in semantic mode
  useEffect(() => {
    if (searchMode !== 'semantic') {
      setSemanticResults([]);
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    
    async function fetchSemanticResults() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: qParam,
            category: categoryParam,
            tags: selectedTags,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch semantic results: ${res.statusText}`);
        }

        const data = await res.json();
        if (isCurrent) {
          setSemanticResults(data);
        }
      } catch (err) {
        console.error('Error fetching semantic search:', err);
        if (isCurrent) {
          setSemanticResults([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    fetchSemanticResults();

    return () => {
      isCurrent = false;
    };
  }, [qParam, categoryParam, selectedTags, searchMode]);

  // Execute Search & Filtering depending on mode
  const results = useMemo(() => {
    if (searchMode === 'semantic') {
      return semanticResults;
    }

    let list: Article[] = [];

    if (qParam.trim().length > 0) {
      // Perform keyword search with MiniSearch
      const searchResults = miniSearch.search(qParam);
      // Map search results back to original Articles structure
      list = searchResults as unknown as Article[];
    } else {
      // Default: show all articles
      list = articles;
    }

    // Apply category filter
    if (categoryParam) {
      list = list.filter((article) => article.category === categoryParam);
    }

    // Apply tag filters (article must match all selected tags)
    if (selectedTags.length > 0) {
      list = list.filter((article) => 
        selectedTags.every((tag) => article.tags.includes(tag))
      );
    }

    return list;
  }, [searchMode, semanticResults, qParam, categoryParam, selectedTags]);

  return {
    query: localQuery,
    setQuery: setLocalQuery,
    debouncedQuery: qParam,
    selectedCategory: categoryParam,
    setSelectedCategory: setCategory,
    selectedTags,
    toggleTag,
    searchMode,
    setSearchMode,
    isLoading,
    results,
    clearAllFilters,
    allCategories,
    allTags,
    totalArticlesCount: articles.length,
  };
}
