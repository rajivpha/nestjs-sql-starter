import SignupOtpLogs from '../auth/entities/signup-otp-logs.entity';
import User from './entities/user.entity';

export const userProvider = [
  {
    provide: 'USER_MODEL',
    useValue: User,
  },
];
