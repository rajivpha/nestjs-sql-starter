import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UserRoleMappingsDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import Role from './entities/role.entity';
import UserRoleMappings from './entities/user-role-mapping.entity';
import { Op } from 'sequelize';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(UserRoleMappings)
    private readonly userRoleModel: typeof UserRoleMappings
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async findUserByRoleCodes(codes: string[]) {
    const users = await this.userRoleModel.findAll({
      attributes: ['userId'],
      where: {},
      include: [
        {
          attributes: ['id', 'code'],
          required: true,
          model: Role,
          where: {
            code: {
              [Op.in]: codes,
            },
          },
        },
      ],
    });

    return users;
  }

  async saveUserRoleMappings(userRoleDto: UserRoleMappingsDto) {
    const { userId, userRole } = userRoleDto;
    await this.userRoleModel.destroy({
      where: {
        userId: userId,
      },
    });
    for (let i = 0; i < userRole.length; i++) {
      const element = userRole[i];

      const roleDetail = await this.roleModel.findOne({
        where: {
          code: element,
        },
      });

      await this.userRoleModel.create({
        userId: userId,
        roleId: roleDetail.id,
      });
    }
  }
}
