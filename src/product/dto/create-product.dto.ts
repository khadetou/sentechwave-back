import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsString()
  // @IsNotEmpty()
  @IsOptional()
  images?: any;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  subcategory: string;

  @IsString()
  @IsOptional()
  itemscategory: string;

  @IsString()
  @IsOptional()
  subsubcategory: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  sizes: string;

  @IsNumber()
  @IsOptional()
  oldPrice: number;

  @IsNumber()
  @IsNotEmpty()
  countInStock: number;
}
