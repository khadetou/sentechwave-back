import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthUpdateCredentialsDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  password: string;
}
