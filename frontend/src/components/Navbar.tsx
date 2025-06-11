'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes, FaUser } from 'react-icons/fa'
import Image from 'next/image'
import { Section } from "@/domain/models"
import { SignOutButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [sections, setSections] = useState<Section[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, isLoaded } = useUser()

  const [imgSrc, setImgSrc] = useState(user?.imageUrl ?? '/images/avatar.png')
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/sections')
        if (!res.ok) throw new Error('Failed to fetch sections')
        const data = await res.json()
        setSections(data)
      } catch (err) {
        console.error('Error fetching sections:', err)
      }
    }
    fetchSections()
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-blue-300 transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Friki Zone
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ?
              <FaTimes className="w-6 h-6" /> :
              <FaBars className="w-6 h-6" />
            }
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {sections.map(section => (
              <Link
                key={section.id}
                href={section.link}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition duration-200 relative group"
              >
                {section.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Icons Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-blue-700 transition duration-200"
                aria-label="Buscar"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "250px" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                  >
                    <form onSubmit={handleSearch} className="flex items-center p-2">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md transition duration-200"
                      >
                        <FaSearch className="w-5 h-5" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-full hover:bg-blue-700 transition duration-200 relative"
              aria-label="Lista de deseos"
            >
              <FaHeart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-blue-700 transition duration-200 relative"
              aria-label="Carrito de compras"
            >
              <FaShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-1 p-1 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Perfil de usuario"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-300">
                  <Image
                    src={imgSrc}
                    alt="Perfil"
                    fill
                    className="object-cover bg-gray-300"
                    onError={() => setImgSrc('/images/avatar.png')}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {isLoaded && user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">{user.fullName || user.firstName}</p>
                          <p className="text-xs text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 transition duration-200">
                          Mi Perfil
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 transition duration-200">
                          Mis Pedidos
                        </Link>
                        <div className="px-4 py-2 border-t border-gray-700">
                          <SignOutButton>
                            <button className="w-full text-left text-sm text-red-400 hover:text-red-300 transition duration-200">
                              Cerrar Sesión
                            </button>
                          </SignOutButton>
                        </div>
                      </>
                    ) : (
                      <>
                          <Link href="/sign-in" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 transition duration-200">
                            Iniciar Sesión
                          </Link>
                        <Link href="/sign-up" className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 transition duration-200">
                          Registrarse
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 shadow-inner"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {sections.map(section => (
                <Link
                  key={section.id}
                  href={section.link}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-blue-700 hover:text-white transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {section.title}
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-700">
                <form onSubmit={handleSearch} className="flex items-center p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-l-md focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="mt-3 flex justify-around">
                {isLoaded && user && (
                  <Link
                    href="/wishlist"
                    className="flex flex-col items-center px-4 py-2 text-gray-300 hover:text-white transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <FaHeart className="w-6 h-6" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {wishlistItems.length}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-1">Favoritos</span>
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="flex flex-col items-center px-4 py-2 text-gray-300 hover:text-white transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <FaShoppingCart className="w-6 h-6" />
                    {items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {items.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1">Carrito</span>
                </Link>

                <Link
                  href={isLoaded && user ? "/profile" : "/sign-in"}
                  className="flex flex-col items-center px-4 py-2 text-gray-300 hover:text-white transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="w-6 h-6" />
                  <span className="text-xs mt-1">{isLoaded && user ? "Perfil" : "Iniciar Sesión"}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}