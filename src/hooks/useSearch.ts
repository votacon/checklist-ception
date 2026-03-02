import { useState, useMemo, useCallback } from "react";
import type { ChecklistItem } from "../types";
import { searchTree, type SearchResult } from "../utils/search";

export function useSearch(items: ChecklistItem[]) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results: SearchResult[] = useMemo(
    () => (isOpen && query.trim() ? searchTree(items, query) : []),
    [items, query, isOpen],
  );

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    isOpen,
    open,
    close,
    results,
  };
}
