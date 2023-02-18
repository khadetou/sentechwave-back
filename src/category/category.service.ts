import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategory } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schema/category-schema';
import slugify from 'slugify';
import { Model } from 'mongoose';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  //    CREATE CATEGORY
  async createCategory(createProductDto: CreateCategory): Promise<Category> {
    const { name } = createProductDto;
    let slug = slugify(name).toLowerCase();

    const category = new this.categoryModel({
      name,
      slug,
    });

    try {
      return await category.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //    GET ALL CATEGORIES
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   GET BY SLUG
  async getCategory(slug: string): Promise<Category[]> {
    const slugy = slug.toLowerCase();

    try {
      return await this.categoryModel.findOne({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   REMOVE CATEGORY
  async deleteCategory(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.categoryModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
