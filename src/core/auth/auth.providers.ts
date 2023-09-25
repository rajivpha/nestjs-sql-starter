import ForgotPassword from './entities/forgot-password-logs.entity';
import SignupOtpLogs from './entities/signup-otp-logs.entity';

export const authProviders = [
  {
    provide: 'FORGOT_PWD_REPOSITORY',
    useValue: ForgotPassword,
  },
  {
    provide: 'SIGNUP_OTP_REPOSITORY',
    useValue: SignupOtpLogs,
  },
];
