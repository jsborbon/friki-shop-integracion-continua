import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  image?: string;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsNumber()
  total: number;

  @IsString()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}