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
import { CategoryService } from './category.service';
import { CreateCategory } from './dto/create-category.dto';
import { Category } from './schema/category-schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // CREATE CATEGORY
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async createCategory(
    @Body() createCategory: CreateCategory,
  ): Promise<Category> {
    return await this.categoryService.createCategory(createCategory);
  }

  //   GET ALL CATEGORIES
  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }

  //   GET CATEGORY BY SLUG
  @Get('/:slug')
  async getCategoryById(@Param('slug') slug: string): Promise<Category> {
    return await this.getCategoryById(slug);
  }

  // DELETE CATEGORY
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  @Roles(Role.Admin)
  async deleteCategory(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.categoryService.deleteCategory(slug);
  }
}
