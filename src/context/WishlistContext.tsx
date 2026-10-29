'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  clearWishlist: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'jeto_vacations_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Save changes to localStorage
  const saveToStorage = (updated: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const isWishlisted = (slug: string): boolean => {
    return wishlist.includes(slug);
  };

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      let next: string[];
      if (prev.includes(slug)) {
        next = prev.filter((s) => s !== slug);
      } else {
        next = [...prev, slug];
        // Open drawer on first few saves for delight
        setIsDrawerOpen(true);
      }
      saveToStorage(next);
      return next;
    });
  };

  const removeFromWishlist = (slug: string) => {
    setWishlist((prev) => {
      const next = prev.filter((s) => s !== slug);
      saveToStorage(next);
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    saveToStorage([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
