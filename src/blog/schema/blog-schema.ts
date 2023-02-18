import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Category } from 'src/category/schema/category-schema';
import { Tags } from 'src/tags/schema/tags-schema';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({
    type: String,
    trim: true,
    min: 3,
    max: 160,
    required: true,
  })
  title: string;
  @Prop({ type: String, unique: true, index: true })
  slug: string;
  @Prop({ type: {}, required: true, min: 200, max: 2000000 })
  body: {};
  @Prop({ type: String, max: 1000 })
  excerpt: string;
  @Prop({
    type: String,
  })
  mdesc: any;
  @Prop({
    type: {
      public_id: { type: String },
      url: { type: String },
      format: { type: String },
      width: { type: Number },
      height: { type: Number },
    },
  })
  image: {
    public_id: string;
    url: string;
    format: string;
    width: number;
    height: number;
  };

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    ],
  })
  category: [typeof Category];

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Tags', required: true },
    ],
  })
  tags: [typeof Tags];
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
