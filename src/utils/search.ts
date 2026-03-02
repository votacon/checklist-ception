import type { ChecklistItem } from "../types";

export interface MatchRange {
  start: number;
  end: number;
}

export interface SearchResult {
  item: ChecklistItem;
  path: string[];
  pathTexts: string[];
  ranges: MatchRange[];
}

export function fuzzyMatch(query: string, text: string): MatchRange[] | null {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const ranges: MatchRange[] = [];
  let qi = 0;

  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) {
      const start = ti;
      while (ti < lowerText.length && qi < lowerQuery.length && lowerText[ti] === lowerQuery[qi]) {
        ti++;
        qi++;
      }
      ranges.push({ start, end: ti });
      ti--;
    }
  }

  if (qi < lowerQuery.length) return null;
  return ranges;
}

export function searchTree(
  items: ChecklistItem[],
  query: string,
  path: string[] = [],
  pathTexts: string[] = [],
): SearchResult[] {
  const results: SearchResult[] = [];
  if (!query.trim()) return results;

  for (const item of items) {
    const ranges = fuzzyMatch(query, item.text);
    if (ranges) {
      results.push({ item, path: [...path], pathTexts: [...pathTexts], ranges });
    }
    const subResults = searchTree(
      item.subtasks,
      query,
      [...path, item.id],
      [...pathTexts, item.text],
    );
    results.push(...subResults);
  }

  return results;
}
