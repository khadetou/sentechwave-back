import { Optional } from '@nestjs/common';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsString()
  // @IsNotEmpty()
  @Optional()
  images?: any;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: any;

  @IsString()
  @IsOptional()
  subcategory: any;

  @IsString()
  @IsOptional()
  itemscategory: any;

  @IsString()
  @IsOptional()
  subsubcategory: any;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  sizes: string[];

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsNumber()
  @IsOptional()
  price: number;
  @IsNumber()
  @IsOptional()
  oldPrice: number;

  @IsNumber()
  @IsNotEmpty()
  countInStock: number;
}
