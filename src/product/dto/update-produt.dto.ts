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
  specification: any;

  @IsOptional()
  @IsString({ each: true })
  sizes: string[];

  @IsOptional()
  @IsString({ each: true })
  styles: string[];

  @IsOptional()
  @IsString({ each: true })
  colors: string[];

  @IsOptional()
  @IsString()
  sku: string;

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
