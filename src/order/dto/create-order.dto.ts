import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Product } from 'src/product/schema/product.schema';

export interface OrderItems {
  name: string;
  qty: number;
  image: any;
  price: number;
  product: Product;
}
export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export class CreateOrderDto {
  @IsNotEmpty()
  orderItems: OrderItems[];
  @IsNotEmpty()
  shippingAddress: ShippingAddress;
  @IsNumber()
  @IsNotEmpty()
  itemsPrice: number;
  @IsNumber()
  @IsNotEmpty()
  shippingPrice: number;
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
