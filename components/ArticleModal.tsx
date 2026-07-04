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

  // Lock body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Trap focus inside the modal for accessibility
  useEffect(() => {
    if (!modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus close button initially
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

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
    };
  }, []);

  // Handle ESC key press globally (or let the parent handle it)
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        ref={modalRef}
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
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
          <h1 className="modal-title">{article.title}</h1>
          
          {/* Metadata Block */}
          <div className="modal-article-meta">
            <div className="modal-meta-item">
              <User size={14} className="text-[var(--text-muted)]" />
              <span>{article.author}</span>
            </div>
            <div className="modal-meta-item">
              <Calendar size={14} className="text-[var(--text-muted)]" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="modal-meta-item">
              <Clock size={14} className="text-[var(--text-muted)]" />
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
