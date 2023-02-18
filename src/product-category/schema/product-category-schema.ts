import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SubCategories } from './subcategories-schema';

export type ProductCategoryDocument = ProductCategory & Document;

@Schema()
export class ProductCategory {
  @Prop({
    type: String,
    trim: true,
    required: true,
    max: 32,
  })
  name: string;
  @Prop({
    type: String,
    unique: true,
    index: true,
  })
  slug: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategories' }],
  })
  subcategories: SubCategories[];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
