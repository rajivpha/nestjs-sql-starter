import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class VerifySignUpOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
export interface ForgotPasswordResponse {
  token: string;
}

export class VerifyForgotPasswordOtp {
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ChangePasswordInput {
  @IsOptional()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  currentPassword: string;
}
export class RefreshTokenInput {
  @IsOptional()
  @IsString()
  refreshToken: string;
}
