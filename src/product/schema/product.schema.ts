import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { ItemCategories } from 'src/product-category/schema/itemcategories-schema';
import { ProductCategory } from 'src/product-category/schema/product-category-schema';
import { SubCategories } from 'src/product-category/schema/subcategories-schema';
import { SubSubCategories } from 'src/product-category/schema/subsubcategories-schema';
export type ReviewsDocument = Reviews & Document;
export type ProductDocument = Product & Document;

@Schema()
export class Reviews {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Number, required: true })
  rating: number;
  @Prop({ type: String, required: true })
  comment: string;
  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

@Schema()
export class Product {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({
    type: [
      {
        public_id: { type: String },
        url: { type: String },
        format: { type: String },
        width: { type: Number },
        height: { type: Number },
      },
    ],
  })
  images: {
    public_id: string;
    url: string;
    format: string;
    width: number;
    heigth: number;
  }[];

  @Prop({ type: String, required: true })
  brand: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemCategories',
  })
  itemcategory: ItemCategories;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubSubCategories',
  })
  subsubcategory: SubSubCategories;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategories',
  })
  subcategory: SubCategories;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  })
  category: ProductCategory;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: [String],
    default: '',
    required: false,
  })
  sizes: string[];

  @Prop([Reviews])
  reviews: Reviews[];

  @Prop({ type: Number, required: true, default: 0 })
  rating: number;

  @Prop({ type: Number, required: true, default: 0 })
  numbReviews: number;

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop({ type: Number, required: true, default: 0 })
  oldPrice: number;

  @Prop({ type: Number, required: true, default: 0 })
  countInStock: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
