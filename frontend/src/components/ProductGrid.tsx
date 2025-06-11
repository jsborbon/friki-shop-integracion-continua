'use client'

import ProductCard from './ProductCard'
import { ProductWithCategory } from '@/domain/models'

interface ProductGridProps {
  products: ProductWithCategory[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            description={product.description}
            category={product.category}
          />
        ))}
      </div>
    </div>
  )
}