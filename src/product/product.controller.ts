import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decoration';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { User } from 'src/auth/schema/user.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateReviewsDto } from './dto/create-review.dto';
import { GetProductsFilterDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-produt.dto';
import { ProductsService } from './product.service';
import { Product } from './schema/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() getProductsFilterDto: GetProductsFilterDto,
  ): Promise<Product[]> {
    return await this.productsService.getProducts(getProductsFilterDto);
  }

  //CREATE PRODUCT
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDto, user);
  }

  //GET TOP RATED PRODUCT
  @Get('/top-rated')
  async getTopRatedProducts(): Promise<Product[]> {
    return await this.productsService.getTopRatedProducts();
  }

  //CREATE REVIEWS
  @Post('/:id/reviews')
  @UseGuards(AuthGuard())
  async createReviews(
    @Body() createReviewsDto: CreateReviewsDto,
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productsService.createReviews(createReviewsDto, id, user);
  }

  // UPDATE PRODUCT
  @Put('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(updateProductDto, id);
  }

  //GET PRODUCT BY ID
  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  //DELETE PRODUCT BY ID
  @Delete('/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.deleteProduct(id);
  }
}
