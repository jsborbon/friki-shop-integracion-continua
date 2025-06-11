import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { Request } from "express";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException("User ID required", HttpStatus.UNAUTHORIZED);
      }
      return await this.cartService.getCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch cart",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async addToCart(
    @Req() req: Request,
    @Body(ValidationPipe) createCartItemDto: CreateCartItemDto,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException("User ID required", HttpStatus.UNAUTHORIZED);
      }
      return await this.cartService.addToCart({ ...createCartItemDto, userId });
    } catch (error) {
      throw new HttpException(
        "Failed to add item to cart",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(":productId")
  async updateCartItemQuantity(
    @Req() req: Request,
    @Param("productId") productId: string,
    @Body("quantity", ParseIntPipe) quantity: number,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID is required for this operation.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.cartService.updateItemQuantity(
        userId,
        productId,
        quantity,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to update cart item quantity",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":productId")
  async removeFromCart(
    @Req() req: Request,
    @Param("productId") productId: string,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID is required for this operation.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.cartService.removeFromCart(userId, productId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to remove item from cart",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException("User ID required", HttpStatus.UNAUTHORIZED);
      }
      return await this.cartService.clearCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to clear cart",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}