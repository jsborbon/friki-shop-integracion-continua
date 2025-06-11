import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        metadata: createProductDto.metadata || {},
      },
    });
  }

  async findAll(
    category?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const filters: Prisma.ProductWhereInput = {};

    if (category && Object.values(Category).includes(category as Category)) {
      filters.category = category as Category;
    }

    if (page <= 0 || pageSize <= 0) {
      throw new Error('Page and pageSize must be positive integers');
    }

    return this.prisma.product.findMany({
      where: filters,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async search(query: string, category?: string) {
    const filters: Prisma.ProductWhereInput = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (category && Object.values(Category).includes(category as Category)) {
      filters.category = category as Category;
    }

    return this.prisma.product.findMany({
      where: filters,
      orderBy: { id: 'desc' },
    });
  }
}