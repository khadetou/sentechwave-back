import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import {
  CreateItemCategoryDto,
  CreateProductCategoryDto,
  CreateSubProductCategoryDto,
  CreateSubSubProductCategoryDto,
} from './dto/create-category-product.dto';
import { ItemCategories } from './schema/itemcategories-schema';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schema/product-category-schema';
import {
  SubCategories,
  SubCategoriesDocument,
} from './schema/subcategories-schema';
import {
  SubSubCategories,
  SubSubCategoriesDocument,
} from './schema/subsubcategories-schema';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly productCategoryModel: Model<ProductCategoryDocument>,
    @InjectModel(SubCategories.name)
    private readonly subCategoriesModel: Model<SubCategoriesDocument>,
    @InjectModel(SubSubCategories.name)
    private readonly subsubCategoriesModel: Model<SubSubCategoriesDocument>,
    @InjectModel(ItemCategories.name)
    private readonly itemCategoriesModel: Model<ItemCategories>,
  ) {}

  //CREATE CATEGORIES
  async createProductCategory(
    createProductDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const { name, _id } = createProductDto;
      let slug = slugify(name).toLowerCase();
      let category: any = await this.getProductCategory(slug);
      if (category) {
        const cat = [...category.subcategories, _id];
        category = this.productCategoryModel.findOneAndUpdate(
          { slug: slug },
          {
            $set: {
              subcategories: cat,
            },
          },
        );
        return category;
      } else {
        const category = new this.productCategoryModel({
          name,
          slug,
          subcategories: _id !== '' ? _id : undefined,
        });
        return await category.save();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async crateSubCategory(
    createSubProductDto: CreateSubProductCategoryDto,
  ): Promise<SubCategories | any> {
    try {
      const { name, _id } = createSubProductDto;
      let slug = slugify(name).toLowerCase();

      let subcategory: any = await this.getSubCategory(slug);
      if (subcategory) {
        const ssc = [...subcategory.subsubcategories, _id];

        subcategory = await this.subCategoriesModel.findOneAndUpdate(
          {
            slug: slug,
          },
          {
            $set: {
              subsubcategories: ssc,
            },
          },
        );
        return await subcategory.save();
      } else {
        const subcategory = new this.subCategoriesModel({
          name,
          slug,
          subsubcategories: _id !== '' ? _id : undefined,
        });
        return await subcategory.save();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async createSubSubCategory(
    createSubSubProductDto: CreateSubSubProductCategoryDto,
  ): Promise<SubSubCategories> {
    const { name, _id } = createSubSubProductDto;
    let slug = slugify(name).toLowerCase();

    const subcategory = new this.subsubCategoriesModel({
      name,
      slug,
      itemcategories: _id !== '' ? _id : undefined,
    });

    try {
      return await subcategory.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async createItemCategory(
    createitemProductDto: CreateItemCategoryDto,
  ): Promise<ItemCategories> {
    const { name } = createitemProductDto;
    let slug = slugify(name).toLowerCase();

    const subcategory = new this.itemCategoriesModel({
      name,
      slug,
    });

    try {
      return await subcategory.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //    GET ALL CATEGORIES
  async getAllProductCategories(): Promise<ProductCategory[]> {
    try {
      return await this.productCategoryModel
        .find({})
        .populate({
          path: 'subcategories',
          populate: {
            path: 'subsubcategories',
          },
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getAllSubCategories(): Promise<SubCategories[]> {
    try {
      return await this.subCategoriesModel
        .find({})
        .populate('subsubcategories')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getAllSubSubCategories(): Promise<SubSubCategories[]> {
    try {
      return await this.subsubCategoriesModel
        .find({})
        .populate('itemcategories')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getAllItems(): Promise<ItemCategories[]> {
    try {
      return await this.itemCategoriesModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   GET BY SLUG
  async getProductCategory(slug: string): Promise<ProductCategory> {
    const slugy = slug.toLowerCase();

    try {
      return await this.productCategoryModel
        .findOne({ slug: slugy })
        .populate('subcategories');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getSubCategory(slug: string): Promise<SubCategories> {
    const slugy = slug.toLowerCase();

    try {
      return await this.subCategoriesModel
        .findOne({ slug: slugy })
        .populate('subsubcategories');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getSubSubCategory(slug: string): Promise<SubSubCategories> {
    const slugy = slug.toLowerCase();

    try {
      return await this.subsubCategoriesModel
        .findOne({ slug: slugy })
        .populate('itemcategories');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getItemCategory(slug: string): Promise<ItemCategories> {
    const slugy = slug.toLowerCase();

    try {
      return await this.itemCategoriesModel.findOne({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   REMOVE CATEGORY
  async deleteProductCategory(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.productCategoryModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteSubCategory(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.subCategoriesModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteSubSubCategory(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.subsubCategoriesModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteItemCategory(slug: string): Promise<{ message: string }> {
    const slugy = slug.toLowerCase();
    try {
      return await this.itemCategoriesModel.findOneAndRemove({ slug: slugy });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
