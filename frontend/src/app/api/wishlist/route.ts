import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true }
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json()

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    const wishlistItem = await prisma.wishlist.create({
      data: { userId, productId }
    })

    return NextResponse.json(wishlistItem)
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}