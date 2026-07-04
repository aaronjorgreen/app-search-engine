'use client';

import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

export default function SkeletonLoader({ count = 3 }: SkeletonLoaderProps) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          {/* Metadata placeholder */}
          <div className="skeleton-meta skeleton-pulse" />
          
          {/* Title placeholder */}
          <div className="skeleton-title skeleton-pulse" style={{ width: idx % 2 === 0 ? '75%' : '60%' }} />
          
          {/* Excerpt/Description placeholders */}
          <div className="skeleton-desc skeleton-pulse" />
          <div className="skeleton-desc-short skeleton-pulse" />
          
          {/* Footer placeholder */}
          <div className="skeleton-footer">
            <div className="skeleton-tags">
              <div className="skeleton-tag skeleton-pulse" />
              <div className="skeleton-tag skeleton-pulse" style={{ width: '40px' }} />
              <div className="skeleton-tag skeleton-pulse" style={{ width: '65px' }} />
            </div>
            <div className="skeleton-time skeleton-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
