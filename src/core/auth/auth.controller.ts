import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordInput,
  CreateAuthDto,
  ForgotPasswordDto,
  RefreshTokenInput,
  VerifyForgotPasswordOtp,
  VerifySignUpOtpDto,
} from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetTokenData } from '@src/decorators/get-token-data.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ResponseMessage(message.SUCCESS.LOGIN)
  @Post('login')
  async login(@Body() payload: CreateAuthDto) {
    return await this.authService.login(payload);
  }

  // @ResponseMessage(message.SUCCESS.LOGIN)
  @Post('sign-up')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  // @ResponseMessage(message.SUCCESS.OTP_VERIFIED)
  @Post('verify/sign-up/otp')
  async verifySignupOtp(@Body() payload: VerifySignUpOtpDto) {
    return await this.authService.verifySignupOtp(payload);
  }

  @ApiBearerAuth()
  // @ResponseMessage(message.SUCCESS.PASSWORD)
  @Post('change-password')
  async changePassword(
    @Body() payload: ChangePasswordInput,
    @GetTokenData('sub') userId: string
  ) {
    return await this.authService.changePassword(payload, userId);
  }

  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@GetTokenData('sub') userId: string) {
    return await this.authService.profile(userId);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.authService.forgotPassword(payload);
  }

  // @ResponseMessage(message.SUCCESS.OTP_VERIFIED)
  @Post('forgot-password/verify/otp')
  async verifyForgotPasswordOtp(@Body() payload: VerifyForgotPasswordOtp) {
    return await this.authService.verifyForgotPasswordOtp(payload);
  }

  // @ResponseMessage(message.SUCCESS.PASSWORD)
  @Post('forgot-password/change-password')
  async forgotPasswordChangePassword(@Body() payload: ChangePasswordInput) {
    return await this.authService.changePassword(payload);
  }

  @Post('refresh-token')
  async refreshToken(@Body() payload: RefreshTokenInput) {
    return await this.authService.refreshToken(payload);
  }
}
