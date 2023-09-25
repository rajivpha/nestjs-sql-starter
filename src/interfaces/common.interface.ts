import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export interface TokenPayload {
  id: string;
  sub: string;
  email: string;
}
export interface CurrentUserPayload {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  email: string;
  language: string;
  registrationType: string;
  profilePicUrl: string;
  organizationId: number;
}
export interface RabbitMqConfigOption {
  urls: string[];
  queue: string;
  queueOptions: object;
  noAck: boolean;
  persistent: boolean;
}

export interface UserResponsePayload {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  email: string;
  language: string;
  businessNo: number;
  registrantStatus: string;
  registrationType: string;
  profilePicUrl: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  subUsers: any;
}

export interface UsersRole {
  userId: number;
  role: Role;
}

export interface Role {
  id: number;
  code: string;
}

export class BaseParamPayload {
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  page: number;
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  limit: number;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  searchPhrase: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  sortColumn: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  sortValue: string;
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsIn(['true', 'false', 'all'])
  deActive: string;
}
