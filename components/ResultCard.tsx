'use client';

import React from 'react';
import { Clock, Calendar, User, BookOpen, ArrowRight } from 'lucide-react';
import { Article } from '../hooks/useArticleSearch';
import { highlightText, getSnippet } from '../lib/searchUtils';

interface ResultCardProps {
  article: Article;
  searchQuery: string;
  isKeyboardFocused: boolean;
  onClick: () => void;
}

export default function ResultCard({
  article,
  searchQuery,
  isKeyboardFocused,
  onClick,
}: ResultCardProps) {
  // Determine whether to display the description or a dynamic body snippet
  const snippet = searchQuery ? getSnippet(article.content, searchQuery) : '';
  const matchInContent = searchQuery && 
    searchQuery.toLowerCase().split(/\s+/).some(term => 
      term.trim() && article.content.toLowerCase().includes(term.toLowerCase())
    );

  const textToDisplay = matchInContent ? snippet : article.description;
  const isSnippet = matchInContent;

  const renderHighlighted = (text: string) => {
    if (!searchQuery) return <span>{text}</span>;
    const parts = highlightText(text, searchQuery);
    return (
      <>
        {parts.map((part, index) =>
          part.isMatch ? (
            <mark key={index}>{part.text}</mark>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </>
    );
  };

  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  // Convert category name to a class-friendly slug
  const categorySlug = article.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const cardClass = `result-card cat-${categorySlug} ${isKeyboardFocused ? 'keyboard-focused' : ''}`;

  return (
    <article
      className={cardClass}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={isKeyboardFocused}
    >
      {/* Category and Date Metadata */}
      <div className="card-meta">
        <span className="card-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <BookOpen size={12} />
          {article.category}
        </span>
        <span className="card-dot">•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} />
          {formatDate(article.date)}
        </span>
        <span className="card-dot">•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <User size={12} />
          {article.author}
        </span>
      </div>

      {/* Title */}
      <h3 className="card-title">{renderHighlighted(article.title)}</h3>

      {/* Description or Dynamic Content Snippet */}
      {isSnippet ? (
        <div className="card-snippet">
          {renderHighlighted(textToDisplay)}
        </div>
      ) : (
        <p className="card-description">{renderHighlighted(textToDisplay)}</p>
      )}

      {/* Footer (Tags & Read Time & Read Link) */}
      <div className="card-footer">
        <div className="card-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="card-tag">
              #{tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="card-readtime" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            <span>{article.readTime}</span>
          </div>
          <span className="read-more-link" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}
