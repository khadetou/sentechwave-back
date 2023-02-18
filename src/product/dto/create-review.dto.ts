import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewsDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
