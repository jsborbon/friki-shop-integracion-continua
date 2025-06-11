import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch {
      throw new HttpException(
        "Failed to create product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query("category") category?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ) {
    try {
      const pageNum = page ? parseInt(page, 10) : 1;
      const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;

      if (pageNum <= 0 || pageSizeNum <= 0) {
        throw new HttpException(
          "Page and pageSize must be positive integers",
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.productsService.findAll(
        category?.toUpperCase(),
        pageNum,
        pageSizeNum,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch products",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("search")
  async search(
    @Query("q") query: string,
    @Query("category") category?: string,
  ) {
    try {
      if (!query) {
        throw new HttpException(
          "Search query is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.productsService.search(query, category?.toUpperCase());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to search products",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch {
      throw new HttpException(
        "Failed to update product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.productsService.remove(id);
    } catch {
      throw new HttpException(
        "Failed to delete product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
