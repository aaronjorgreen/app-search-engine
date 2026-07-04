export interface HighlightPart {
  text: string;
  isMatch: boolean;
}

/**
 * Splits text into matched and unmatched parts based on search terms.
 * Useful for React rendering where parts can be wrapped in custom HTML/JSX tags.
 */
export function highlightText(text: string, query: string): HighlightPart[] {
  if (!text) return [];
  if (!query) return [{ text, isMatch: false }];

  // Clean and split the query into individual keywords
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.trim().length > 0);

  if (terms.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Sort terms by length descending to match longer phrases/terms first
  terms.sort((a, b) => b.length - a.length);

  // Escape special regex characters
  const escapedTerms = terms.map((t) => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

  // Create regex pattern to match any of the terms (case-insensitive)
  // We match the terms directly to support prefix/partial highlighting
  const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const parts: HighlightPart[] = [];
  let lastIndex = 0;

  text.replace(pattern, (match, p1, offset) => {
    // Add preceding unmatched text
    if (offset > lastIndex) {
      parts.push({ text: text.substring(lastIndex, offset), isMatch: false });
    }
    // Add matched text
    parts.push({ text: match, isMatch: true });
    lastIndex = offset + match.length;
    return match;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.substring(lastIndex), isMatch: false });
  }

  return parts;
}

/**
 * Extracts a snippet of text (~150 chars) from a body of content
 * centered around the first match of the search query terms.
 */
export function getSnippet(content: string, query: string, maxLength = 150): string {
  if (!content) return '';
  if (!query) {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.trim().length > 0);

  if (terms.length === 0) {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  // Find the first index where any of the terms match (case-insensitive)
  let firstMatchIdx = -1;
  let matchedTermLength = 0;

  for (const term of terms) {
    const idx = content.toLowerCase().indexOf(term);
    if (idx !== -1 && (firstMatchIdx === -1 || idx < firstMatchIdx)) {
      firstMatchIdx = idx;
      matchedTermLength = term.length;
    }
  }

  // If no term matches inside content, return the beginning of the content
  if (firstMatchIdx === -1) {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  // Calculate standard half-window size
  const halfWindow = Math.floor((maxLength - matchedTermLength) / 2);
  let startIdx = Math.max(0, firstMatchIdx - halfWindow);
  let endIdx = Math.min(content.length, firstMatchIdx + matchedTermLength + halfWindow);

  // Adjust start boundary to align with word boundaries
  if (startIdx > 0) {
    // Find the next space after startIdx to avoid cut-off words
    const nextSpace = content.indexOf(' ', startIdx);
    if (nextSpace !== -1 && nextSpace < firstMatchIdx) {
      startIdx = nextSpace + 1;
    }
  }

  // Adjust end boundary to align with word boundaries
  if (endIdx < content.length) {
    // Find the last space before endIdx
    const lastSpace = content.lastIndexOf(' ', endIdx);
    if (lastSpace !== -1 && lastSpace > firstMatchIdx + matchedTermLength) {
      endIdx = lastSpace;
    }
  }

  let snippet = content.substring(startIdx, endIdx).trim();

  // Add ellipsis if text is truncated at start or end
  if (startIdx > 0) {
    snippet = '...' + snippet;
  }
  if (endIdx < content.length) {
    snippet = snippet + '...';
  }

  return snippet;
}
