import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Role from './entities/role.entity';
import UserRoleMappings from './entities/user-role-mapping.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role, UserRoleMappings])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
