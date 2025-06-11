import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  userId: string;

  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}