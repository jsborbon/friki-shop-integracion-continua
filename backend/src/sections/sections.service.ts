import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.section.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    description: string;
    image: string;
    link: string;
  }) {
    return this.prisma.section.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      image?: string;
      link?: string;
    },
  ) {
    return this.prisma.section.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.section.delete({
      where: { id },
    });
  }
}