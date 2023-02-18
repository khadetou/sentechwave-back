import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: any;

  @IsOptional()
  image: any;

  @IsOptional()
  category: any;

  @IsString()
  @IsNotEmpty()
  mdesc: string;

  @IsOptional()
  tags: any;
}
