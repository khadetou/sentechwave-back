import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ItemCategoriesDocument = ItemCategories & Document;
@Schema()
export class ItemCategories {
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

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ItemCategoriesSchema =
  SchemaFactory.createForClass(ItemCategories);
