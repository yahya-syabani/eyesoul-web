"use client";

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'eyesoul-wishlist';

function loadWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: number[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>(loadWishlist);

  const toggle = useCallback((productId: number) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      saveWishlist(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId: number) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const clear = useCallback(() => {
    setWishlist([]);
    saveWishlist([]);
  }, []);

  return { wishlist, toggle, isWishlisted, clear };
}
