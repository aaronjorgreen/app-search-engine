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
  const selectedTags = useMemo(() => {
    return tagsParam ? tagsParam.split(',').filter((t) => t.length > 0) : [];
  }, [tagsParam]);

  // Local state for immediate input value (prevents typing lag)
  const [localQuery, setLocalQuery] = useState(qParam);

  // Sync local query if URL parameter changes (e.g. back navigation or reset)
  useEffect(() => {
    setLocalQuery(qParam);
  }, [qParam]);

  // Debounced URL updates for query param
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Parse search params dynamically to avoid stale state issues
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

  // Reset all filters and search input
  const clearAllFilters = useCallback(() => {
    setLocalQuery('');
    router.replace('?', { scroll: false });
  }, [router]);

  // Execute Search & Filtering
  const results = useMemo(() => {
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
  }, [qParam, categoryParam, selectedTags]);

  return {
    query: localQuery,
    setQuery: setLocalQuery,
    debouncedQuery: qParam,
    selectedCategory: categoryParam,
    setSelectedCategory: setCategory,
    selectedTags,
    toggleTag,
    results,
    clearAllFilters,
    allCategories,
    allTags,
    totalArticlesCount: articles.length,
  };
}
