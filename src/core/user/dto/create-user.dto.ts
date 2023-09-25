import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
  ValidateNested,
  IsInt,
} from 'class-validator';

export enum RegistrantStatus {
  'pending' = 'pending',
  'active' = 'active',
  'suspended' = 'suspended',
  'deleted' = 'deleted',
}

export class Permission {
  @ApiProperty()
  licenseType: string;
  @ApiProperty()
  licenseId: string;
  @ApiProperty()
  modules: Module[];
}

export class Module {
  @ApiProperty()
  moduleCode: string;
  @ApiProperty()
  moduleName: string;
  @ApiProperty()
  privileges: Privilege[];
}
export class PermissionMappingResp {
  @ApiProperty()
  moduleId: number;
  @ApiProperty()
  moduleCode: string;
  @ApiProperty()
  moduleName: string;
  @ApiProperty()
  privileges: Privilege[];
}

export class Privilege {
  @ApiProperty()
  privilegeId: number;
  @ApiProperty()
  privilegeCode: string;
  @ApiProperty()
  privilegeName: string;
}

export class UserRole {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PermissionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['application', 'markers', 'bales'])
  module: string;
  @ApiProperty({
    example: ['all', 'view', 'apply'],
    description: 'privilege',
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @IsIn(
    [
      'all',
      'view',
      'apply',
      'edit',
      'receive',
      'request',
      'return',
      'delete',
      'add',
      'cancel',
    ],
    {
      each: true,
    }
  )
  privileges: string[];
}
export class LicensePermissions {
  @IsNotEmpty()
  @IsString()
  licenseType: string;
  @IsNotEmpty()
  @IsString()
  licenseId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permission: PermissionDto[];
}
