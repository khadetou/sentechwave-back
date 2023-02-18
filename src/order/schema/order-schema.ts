import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        images: [
          {
            public_id: { type: String },
            url: { type: String },
            format: { type: String },
            width: { type: Number },
            height: { type: Number },
          },
        ],
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'product',
        },
      },
    ],
  })
  orderItems: {
    name: string;
    qty: number;
    images: {
      public_id: string;
      url: string;
      format: string;
      width: number;
      height: number;
    }[];
    price: number;
    product: Product;
  }[];
  @Prop({
    type: {
      address: { type: String, required: true },
      city: { type: String },
      phone: { type: String, required: true },
      region: { type: String, required: true },
    },
  })
  shippingAddress: {
    address: string;
    city?: string;
    phone: string;
    region: string;
  };

  @Prop({
    type: {
      _id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
  })
  paymentResult?: {
    _id: string;
    status: string;
    update_time: string;
    email_address: string;
  };

  @Prop({ type: Number, required: true, default: 0.0 })
  itemsPrice: number;

  @Prop({
    type: Number,
    required: true,
    default: false,
  })
  shippingPrice: number;

  @Prop({
    type: Number,
    required: true,
    default: false,
  })
  totalPrice: number;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isPaid: boolean;

  @Prop({
    type: Number,
  })
  paidAt: number;

  @Prop({ type: Boolean, required: true, default: false })
  isShipped: boolean;

  @Prop({
    type: Number,
  })
  delivereAt: number;

  @Prop({
    type: Date,
  })
  shippedAt: Date;

  @Prop({ type: Date })
  timer?: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
