import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsEnum(Category)
  category: Category;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}