import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagsDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
