import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
interface ContentCardProps {
  title: string
  price: number
  description: string
  image: string
  link: string
}

export default function ContentCard({ title, price, description, image, link }: ContentCardProps) {
  const [imgSrc, setImgSrc] = useState<string>('/images/not-found.jpg');

  useEffect(() => {
    if (image) {
      setImgSrc(image);
    }
  }, [image]);

  return (
    <Link href={link}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48 w-full">
          <Image
            src={imgSrc}
            onError={() => setImgSrc('/images/not-found.jpg')}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <h3 className="text-lg font-semibold mb-2 text-gray-500">{price}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </Link>
  )
}