import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SubSubCategories } from './subsubcategories-schema';

export type SubCategoriesDocument = SubCategories & Document;
@Schema()
export class SubCategories {
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategories' }],
  })
  subsubcategories: SubSubCategories[];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const SubCategoriesSchema = SchemaFactory.createForClass(SubCategories);
