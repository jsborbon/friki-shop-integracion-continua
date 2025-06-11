import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Request } from "express";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID required for creating an order",
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.ordersService.create({ ...createOrderDto, userId });
    } catch {
      throw new HttpException(
        "Failed to create order",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findUserOrders(@Req() req: Request) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID required to fetch orders",
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.ordersService.findByUser(userId);
    } catch {
      throw new HttpException(
        "Failed to fetch orders",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("stats")
  async getStats() {
    try {
      return await this.ordersService.getStats();
    } catch {
      throw new HttpException(
        "Failed to fetch order stats",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID required for this operation.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      const order = await this.ordersService.findOne(id, userId);
      if (!order) {
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch order details",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(":id/status")
  async updateStatus(@Param("id") id: string, @Body("status") status: string) {
    try {
      if (!status) {
        throw new HttpException("Status is required", HttpStatus.BAD_REQUEST);
      }
      return await this.ordersService.updateStatus(id, status);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to update order status",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":id")
  async remove(@Req() req: Request, @Param("id") id: string) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new HttpException(
          "User ID required for this operation.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.ordersService.remove(id, userId);
    } catch {
      throw new HttpException(
        "Failed to delete order",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}