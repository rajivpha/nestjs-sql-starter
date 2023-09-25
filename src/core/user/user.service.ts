import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import { createHash } from '@src/utils/other.util';
import Role from '@core/roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userRepository: typeof User
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const isEmailExists = await this.userRepository.findOne({
        attributes: ['id', 'isVerified'],
        where: { email: email },
      });
      if (isEmailExists?.isVerified)
        throw new BadRequestException(`User already exist with this email '${email}'.`);

      const userPayload = {
        ...createUserDto,
        password: await createHash(password),
      };
      let user = isEmailExists;
      if (isEmailExists) await this.update(isEmailExists.id, { ...userPayload });
      else user = await this.userRepository.create(userPayload);

      return user;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async findAll() {
    return await this.userRepository.findAll({
      where: { isActive: true, isVerified: true },
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id, isActive: true, isVerified: true },
      include: [
        {
          attributes: ['id', 'name'],
          model: Role,
          as: 'userRole',
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!user) throw new HttpException('User not found', 400);
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      include: [
        {
          attributes: ['id', 'name'],
          model: Role,
          as: 'userRole',
          through: { attributes: [] },
          required: false,
        },
      ],
      where: { email: email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto | Partial<User>) {
    return await this.userRepository.update({ ...updateUserDto }, { where: { id: id } });
  }

  async changeAccountStatus(userId: string) {
    const userDetail = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userDetail) throw new HttpException(`User does't exist!`, 400);

    return await this.userRepository.update(
      { isActive: !userDetail.isActive },
      { where: { id: userId } }
    );
  }

  async remove(id: string) {
    return await this.userRepository.destroy({ where: { id } });
  }
}
