import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ItemCategories } from './itemcategories-schema';

export type SubSubCategoriesDocument = SubSubCategories & Document;
@Schema()
export class SubSubCategories {
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategories' }],
  })
  itemcategories: ItemCategories[];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const SubSubCategoriesSchema =
  SchemaFactory.createForClass(SubSubCategories);
