'use client';

import React from 'react';
import { Database } from 'lucide-react';

interface HeaderProps {
  totalArticlesCount: number;
}

export default function Header({ totalArticlesCount }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo and Brand */}
        <div className="logo-box">
          <div className="logo-icon">
            <Database size={18} />
          </div>
          <div className="logo-text">
            Signal <span>Ledger</span>
          </div>
          <span className="header-badge">
            Tech Intelligence Archive
          </span>
        </div>

        {/* Article Count Tag */}
        <div className="header-status">
          <span className="status-dot pulse"></span>
          <span>{totalArticlesCount} mock articles loaded</span>
        </div>
      </div>
    </header>
  );
}
