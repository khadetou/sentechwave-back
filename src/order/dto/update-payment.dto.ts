import { IsString } from 'class-validator';

export class UpdatePaymentResultDto {
  @IsString()
  _id: string;
  @IsString()
  status: string;
  @IsString()
  update_time: string;
  @IsString()
  email_address: string;
}
