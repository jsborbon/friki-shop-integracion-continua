'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { ProductWithCategory } from '@/domain/models'

type ProductCardProps = ProductWithCategory

export default function ProductCard({ id, title, price, image, description, category }: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState<string>('/images/not-found.jpg');

    useEffect(() => {
        if (image) {
            setImgSrc(image);
        }
    }, [image]);

    const { addItem } = useCart()
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({ id, title, price, image, description, category })
    }

    return (
        <Link href={`/${category.toLowerCase()}/${id}`}>
            <div className="h-[400px] flex flex-col justify-between bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer overflow-hidden transition-transform hover:scale-105">
                <div className="relative w-full h-48">
                    <Image
                        src={imgSrc}
                        onError={() => setImgSrc('/images/not-found.jpg')}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>
                    <div className="flex-grow"></div>
                    <p className="text-gray-600 dark:text-gray-300">${price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleAddToCart}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (isInWishlist(id)) {
                                    removeFromWishlist(id);
                                } else {
                                    addToWishlist({ id, title, price, image, description, category });
                                }
                            }}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                            {isInWishlist(id) ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}