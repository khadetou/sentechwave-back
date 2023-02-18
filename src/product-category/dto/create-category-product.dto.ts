import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  _id: string;
}
export class CreateSubProductCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  _id: string;
}
export class CreateSubSubProductCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  _id: string;
}
export class CreateItemCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
}
