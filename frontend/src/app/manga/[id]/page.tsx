"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from '@/context/WishlistContext'
import { motion } from "framer-motion";
import { MangaProduct } from "@/domain/models";

import { FaSpinner, FaHeart, FaRegHeart, FaCartPlus } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
export default function MangaProductPage() {
  const params = useParams();
  const { user, isLoaded } = useUser()
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()


  const [product, setProduct] = useState<MangaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('/images/not-found.jpg');

  useEffect(() => {
    if (product?.image) {
      setImgSrc(product.image);
    }
  }, [product?.image]);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch manga product");
        return res.json();
      })
      .then((data: MangaProduct) => {
        if (data.category !== "MANGA") {
          throw new Error("Not a manga product");
        }
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (<div className="flex items-center justify-center p-8 h-64">
      <FaSpinner className="animate-spin text-3xl text-blue-500" />
    </div>)
  }
  if (error || !product) return <div className="text-center p-8 text-red-500">Product Not Found</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div className="relative h-96 w-full">
          <Image src={imgSrc} onError={() => setImgSrc('/images/not-found.jpg')} alt={product.title} fill className="object-contain rounded-lg shadow-lg" />
        </motion.div>

        <motion.div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl text-blue-500">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <ul className="list-disc pl-5">
            {product.metadata?.volume && <li><b>Volume:</b> {product.metadata.volume}</li>}
            {product.metadata?.author && <li><b>Author:</b> {product.metadata.author}</li>}
            {product.metadata?.publisher && <li><b>Publisher:</b> {product.metadata.publisher}</li>}
          </ul>
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Add to Cart Button */}
            <motion.button
              onClick={() => addItem(product)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCartPlus />
              Add to Cart
            </motion.button>
            {isLoaded && user && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist({ id: product.id, title: product.title, price: product.price, image: product.image, description: product.description, category: product.category });
                }
              }}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isInWishlist(product.id) ? (
                <FaHeart className="w-6 h-6 text-red-500" />
              ) : (
                <FaRegHeart className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}