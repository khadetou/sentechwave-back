import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategory {
  @IsString()
  @IsNotEmpty()
  name: string;
}
