'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { WishlistItem } from '@/domain/models'

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<WishlistItem[]>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist')
      return savedWishlist ? JSON.parse(savedWishlist) : []
    }
    return []
  })

  // Update localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: WishlistItem) => {
    setItems(currentItems => {
      if (currentItems.some(item => item.id === newItem.id)) return currentItems
      return [...currentItems, newItem]
    })
  }

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  const isInWishlist = (id: number) => {
    return items.some(item => item.id === id)
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}