import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GoogleAuthCredentialDto {
  @IsString()
  @IsNotEmpty()
  family_name: string;
  @IsString()
  @IsNotEmpty()
  given_name: string;
  @IsString()
  @IsNotEmpty()
  picture: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  sub: string;
  @IsBoolean()
  @IsNotEmpty()
  email_verified: boolean;
}
