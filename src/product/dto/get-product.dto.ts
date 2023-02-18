import { IsOptional, IsString } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  readonly pageSize: number;
  readonly pageNumber: number;
  readonly keyword: any;
  readonly category: any;
  readonly min: any;
  readonly max: any;
  readonly souscategory: any;
  readonly ssouscategory: any;
  readonly qty: any;
}
