import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  ChangePasswordInput,
  CreateAuthDto,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  RefreshTokenInput,
  VerifyForgotPasswordOtp,
  VerifySignUpOtpDto,
} from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, createHash, createOTP } from '@src/utils/other.util';
import ForgotPassword from './entities/forgot-password-logs.entity';
import { TokenPayload } from '@src/interfaces/common.interface';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import SignupOtpLogs from './entities/signup-otp-logs.entity';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject('FORGOT_PWD_REPOSITORY')
    private forgotPasswordRepo: typeof ForgotPassword,

    @Inject('SIGNUP_OTP_REPOSITORY')
    private signupOtpRepository: typeof SignupOtpLogs
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    let user = await this.usersService.findOneByEmail(email);
    if (user) {
      user = user.toJSON();
      if (await comparePassword(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  async createAccessToken(userPayload: TokenPayload) {
    return this.jwtService.sign(userPayload, {
      expiresIn: '24h',
      secret: this.configService.get<string>('JWT.SECRET'),
    });
  }

  async createRefreshToken(userPayload: TokenPayload) {
    const accessToken = await this.createAccessToken(userPayload);

    const refreshToken = this.jwtService.sign(
      {
        data: { userId: userPayload.sub, token: accessToken },
      },
      {
        secret: this.configService.get<string>('JWT.REFRESH_TOKEN_SECRET'),
        expiresIn: '365d',
      }
    );

    return { accessToken, refreshToken };
  }

  async login(credential: CreateAuthDto) {
    const user = await this.validateUser(credential.email, credential.password);
    if (!user) throw new UnauthorizedException('email or password is incorrect');

    if (!user.isVerified) throw new ForbiddenException('User not verified!');

    const payload: TokenPayload = {
      email: user.email,
      sub: user.id,
      id: user.id,
    };

    const { firstName, lastName, email, userRole } = await this.usersService.findById(
      user.id
    );

    const { refreshToken, accessToken } = await this.createRefreshToken(payload);

    return {
      userDetail: {
        sub: user.id,
        id: user.id,
        firstName,
        lastName,
        email,
        userRole,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const otp = await createOTP();

    const signupOtpLogs = await this.signupOtpRepository.create({
      otp: await createHash(otp.toString()),
      userId: user.id,
      isActive: true,
    });

    const token = this.jwtService.sign(
      {
        data: { id: signupOtpLogs.id },
      },
      {
        secret: this.configService.get<string>('JWT.SECRET'),
        expiresIn: '1h',
      }
    );

    return { email: user.email, signUpOtpToken: token };
  }

  async profile(userId: string) {
    let user = await this.usersService.findById(userId);
    user = user.toJSON();
    delete user.password;
    return user;
  }

  async verifySignupOtp(payload: VerifySignUpOtpDto) {
    try {
      const { email, otp, token } = payload;

      const user = await this.usersService.findOneByEmail(email);

      if (!user)
        throw new HttpException(`Provided Email doesn't exists  in our record.`, 400);

      const oauthTokenData = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT.SECRET'),
        ignoreExpiration: false,
      });
      const signupOtpLog = await this.signupOtpLog(oauthTokenData?.data?.id);

      if (!signupOtpLog) throw new HttpException(`Invalid Token`, 400);

      if (+user.id !== +signupOtpLog.userId)
        throw new HttpException(`Email doesn't match with provided token.`, 400);

      const tokenValidTill = signupOtpLog.createdAt.setMinutes(
        signupOtpLog.createdAt.getMinutes() + 30
      );

      if (!(await comparePassword(otp, signupOtpLog.otp)))
        throw new HttpException('invalid otp', 400);
      if (new Date(tokenValidTill) < new Date())
        throw new HttpException('otp expired', 400);

      await this.usersService.update(user.id, {
        isVerified: true,
        isActive: true,
      });
      await this.deActivateSignupOtpLog(user.id);

      const userPayload: TokenPayload = {
        email: user.email,
        sub: user.id,
        id: user.id,
      };
      const { refreshToken, accessToken } = await this.createRefreshToken(userPayload);
      return {
        userDetail: {
          sub: user.id,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,

          email: user.email,
          userRole: user.userRole,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      console.log(err.message);
      if (err?.message === 'jwt expired') throw new HttpException('token expired', 400);
      if (err?.message === 'invalid signature')
        throw new HttpException('invalid token', 400);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    try {
      const { email } = payload;

      const otp = await createOTP();
      console.log(otp);

      // check if user already exist
      const userDetail = await this.usersService.findOneByEmail(email);

      if (!userDetail)
        throw new HttpException(
          'Email is not associated to any user. please use valid email.',
          400
        );

      const forgotPasswordLog = await this.forgotPasswordRepo.create({
        otp: await createHash(otp.toString()),
        userId: userDetail.id,
        isActive: true,
      });

      const token = this.jwtService.sign(
        {
          data: { id: forgotPasswordLog.id },
        },
        {
          secret: this.configService.get<string>('JWT.SECRET'),
          expiresIn: '1h',
        }
      );

      return {
        token,
      };
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async verifyForgotPasswordOtp(verifyForgotPasswordOtp: VerifyForgotPasswordOtp) {
    try {
      const { token: userToken, otp } = verifyForgotPasswordOtp;
      const oauthTokenData = this.jwtService.verify(userToken, {
        secret: this.configService.get<string>('JWT.SECRET'),
        ignoreExpiration: false,
      });
      const forgotPasswordLog = await this.forgotPasswordRepo.findOne({
        where: {
          id: oauthTokenData?.data?.id,
          isActive: true,
        },
      });
      if (!forgotPasswordLog) throw new HttpException('invalid token', 400);

      const tokenValidTill = forgotPasswordLog.createdAt.setMinutes(
        forgotPasswordLog.createdAt.getMinutes() + 30
      );
      if (!(await comparePassword(otp, forgotPasswordLog.otp)))
        throw new HttpException('invalid otp', 400);
      if (new Date(tokenValidTill) < new Date())
        throw new HttpException('otp expired', 400);

      const token = this.jwtService.sign(
        {
          data: { id: forgotPasswordLog.userId },
        },
        {
          secret: this.configService.get<string>('JWT.SECRET'),
          expiresIn: '1h',
        }
      );
      await this.forgotPasswordRepo.update(
        { isActive: false },
        { where: { id: forgotPasswordLog.id } }
      );
      return {
        token,
      };
    } catch (err) {
      console.log(err.message);
      if (err?.message === 'jwt expired') throw new HttpException('token expired', 400);
      if (err?.message === 'invalid signature')
        throw new HttpException('invalid token', 400);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async changePassword(changePasswordInput: ChangePasswordInput, userId?: string) {
    try {
      const { token, password, currentPassword } = changePasswordInput;

      if (!userId) {
        if (!token) throw new HttpException('token is required', 400);

        const oauthTokenData = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT.SECRET'),
          ignoreExpiration: false,
        });
        userId = oauthTokenData.data.id;
      } else {
        const userDetail = await this.usersService.findById(userId);
        if (!(await comparePassword(currentPassword, userDetail.password)))
          throw new HttpException('Invalid Current Password', 400);
      }
      const hashedPassword = await createHash(password);
      await this.usersService.update(userId, {
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      console.log(err.message);
      console.log(err.message);
      if (err?.message === 'jwt expired') throw new HttpException('token expired', 400);
      if (err?.message === 'invalid signature')
        throw new HttpException('invalid token', 400);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const { refreshToken: userInputRefreshTOken } = refreshTokenInput;
    const refreshTokenData = this.jwtService.verify(userInputRefreshTOken, {
      secret: this.configService.get<string>('JWT.REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
    });

    const { userId } = refreshTokenData.data;

    const { email } = await this.usersService.findById(userId);

    const payload: TokenPayload = { email: email, sub: userId, id: userId };

    const { refreshToken, accessToken } = await this.createRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signupOtpLog(id: number) {
    const log = await this.signupOtpRepository.findOne({
      where: { id: id },
    });
    if (!log) throw new HttpException('invalid token', 400);
    return log;
  }

  async deActivateSignupOtpLog(id: string) {
    await this.signupOtpRepository.update(
      { isActive: false },
      {
        where: { id: id },
      }
    );
    return true;
  }
}
