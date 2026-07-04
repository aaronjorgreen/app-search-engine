'use client';

import React, { useEffect, useRef } from 'react';
import { X, Calendar, Clock, User, Tag } from 'lucide-react';
import { Article } from '../hooks/useArticleSearch';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll and prevent layout shift when modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  // Trap keyboard focus and restore focus on unmount
  useEffect(() => {
    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    if (!modalRef.current) return;
    
    const getFocusableElements = () => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          !(el as HTMLButtonElement).disabled
        );
      });
    };

    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      // Focus the close button initially
      focusable[0].focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentFocusable = getFocusableElements();
      if (currentFocusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    
    return () => {
      window.removeEventListener('keydown', handleTabKey);
      // Restore focus to previous element when modal closes
      previousFocusRef.current?.focus();
    };
  }, []);

  // Handle ESC key press globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div 
        ref={modalRef}
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-id"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="card-category">{article.category}</span>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
            title="Press ESC to close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body">
          <h1 id="modal-title-id" className="modal-title">{article.title}</h1>
          
          {/* Metadata Block */}
          <div className="modal-article-meta">
            <div className="modal-meta-item">
              <User size={14} color="var(--text-muted)" />
              <span>{article.author}</span>
            </div>
            <div className="modal-meta-item">
              <Calendar size={14} color="var(--text-muted)" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="modal-meta-item">
              <Clock size={14} color="var(--text-muted)" />
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Typography Article Content */}
          <div className="modal-content">
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().length === 0) return null;
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Article Tags */}
          <div className="modal-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="card-tag">
                <Tag size={10} style={{ marginRight: '4px', display: 'inline' }} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
