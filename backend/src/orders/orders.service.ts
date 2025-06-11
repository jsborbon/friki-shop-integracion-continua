import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, total, status, items } = createOrderDto;

    return this.prisma.order.create({
      data: {
        userId,
        total,
        status,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { date: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.order.findUnique({
      where: { id, userId },
      include: { items: true },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: true },
      orderBy: { date: "desc" },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.order.delete({
      where: { id, userId },
    });
  }

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    const revenueData = await this.prisma.order.aggregate({
      _sum: { total: true },
    });

    return {
      totalOrders,
      totalRevenue: revenueData._sum.total || 0,
    };
  }
}