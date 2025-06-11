import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async addToCart(createCartItemDto: CreateCartItemDto) {
    const { userId, productId, quantity = 1 } = createCartItemDto;

    return this.prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
      include: { product: true },
    });
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number) {
    return this.prisma.cart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeFromCart(userId: string, productId: number) {
    return this.prisma.cart.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cart.deleteMany({
      where: { userId },
    });
  }
}