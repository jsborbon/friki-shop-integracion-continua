import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  async findAll() {
    try {
      return await this.sectionsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch sections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const section = await this.sectionsService.findOne(id);
      if (!section) {
        throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
      }
      return section;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch section',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body()
    createSectionDto: {
      title: string;
      description: string;
      image: string;
      link: string;
    },
  ) {
    try {
      return await this.sectionsService.create(createSectionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create section',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateSectionDto: {
      title?: string;
      description?: string;
      image?: string;
      link?: string;
    },
  ) {
    try {
      return await this.sectionsService.update(id, updateSectionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to update section',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.sectionsService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete section',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}