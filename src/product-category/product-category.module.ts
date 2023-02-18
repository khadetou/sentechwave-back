import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import {
  ItemCategories,
  ItemCategoriesSchema,
} from './schema/itemcategories-schema';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schema/product-category-schema';
import {
  SubCategories,
  SubCategoriesSchema,
} from './schema/subcategories-schema';
import {
  SubSubCategories,
  SubSubCategoriesSchema,
} from './schema/subsubcategories-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
      {
        name: SubCategories.name,
        schema: SubCategoriesSchema,
      },
      {
        name: SubSubCategories.name,
        schema: SubSubCategoriesSchema,
      },
      {
        name: ItemCategories.name,
        schema: ItemCategoriesSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
