import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import {
  CreateItemCategoryDto,
  CreateProductCategoryDto,
  CreateSubProductCategoryDto,
  CreateSubSubProductCategoryDto,
} from './dto/create-category-product.dto';
import { ProductCategoryService } from './product-category.service';
import { ItemCategories } from './schema/itemcategories-schema';
import { ProductCategory } from './schema/product-category-schema';
import { SubCategories } from './schema/subcategories-schema';
import { SubSubCategories } from './schema/subsubcategories-schema';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}
  // CREATE PRODUCT CATEGORY
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @Post('/subcat')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createSubCategories(
    @Body() createSubProductCategoryDto: CreateSubProductCategoryDto,
  ): Promise<SubCategories> {
    return await this.productCategoryService.crateSubCategory(
      createSubProductCategoryDto,
    );
  }

  @Post('/subsubcat')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createSubSubCategories(
    @Body() createSubSubProductCategoryDto: CreateSubSubProductCategoryDto,
  ): Promise<SubSubCategories> {
    return await this.productCategoryService.createSubSubCategory(
      createSubSubProductCategoryDto,
    );
  }

  @Post('/itemscat')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createItemsCategories(
    @Body() createItemCategoryDto: CreateItemCategoryDto,
  ): Promise<ItemCategories> {
    return await this.productCategoryService.createItemCategory(
      createItemCategoryDto,
    );
  }

  //   GET ALL CATEGORIES
  @Get()
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return await this.productCategoryService.getAllProductCategories();
  }
  @Get('/subcat')
  async getAllSubCategories(): Promise<SubCategories[]> {
    return await this.productCategoryService.getAllSubCategories();
  }
  @Get('/subsubcat')
  async getAllSubSubCategories(): Promise<SubSubCategories[]> {
    return await this.productCategoryService.getAllSubSubCategories();
  }
  @Get('/itemscat')
  async getAllItemsCategories(): Promise<ItemCategories[]> {
    return await this.productCategoryService.getAllItems();
  }

  //  GET BY SLUG CATEGORIES
  @Get('/:slug')
  async getBySlugProductCategories(
    @Param('slug') slug: string,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.getProductCategory(slug);
  }
  @Get('/subcat/:slug')
  async getBySlugSubCategories(
    @Param('slug') slug: string,
  ): Promise<SubCategories> {
    return await this.productCategoryService.getSubCategory(slug);
  }
  @Get('/subsubcat/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getBySlugSubSubCategories(
    @Param('slug') slug: string,
  ): Promise<SubSubCategories> {
    return await this.productCategoryService.getSubSubCategory(slug);
  }
  @Get('/itemscat/:slug')
  async getBySlugItemsCategories(
    @Param('slug') slug: string,
  ): Promise<ItemCategories> {
    return await this.productCategoryService.getItemCategory(slug);
  }

  //  DELETE BY SLUG CATEGORIES
  @Delete('/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteProductCategories(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.productCategoryService.deleteProductCategory(slug);
  }
  @Delete('/subcat/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteSubCategories(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.productCategoryService.deleteSubCategory(slug);
  }
  @Delete('/subsubcat/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteSubSubCategories(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.productCategoryService.deleteSubSubCategory(slug);
  }
  @Delete('/itemscat/:slug')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deleteItemsCategories(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.productCategoryService.deleteItemCategory(slug);
  }
}
