import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProvider } from './user.provider';
import { RolesModule } from '@core/roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [UserController],
  providers: [...userProvider, UserService],
  exports: [UserService],
})
export class UserModule {}
