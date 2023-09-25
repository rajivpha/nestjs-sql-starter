import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import User from '@src/core/user/entities/user.entity';
import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  DeletedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import UserRoleMappings from './user-role-mapping.entity';

@Table({ tableName: 'roles', timestamps: true, underscored: true, paranoid: true })
export default class Role extends Model {
  @ApiProperty()
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataTypes.STRING })
  name: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataTypes.STRING })
  description: string;

  @BelongsToMany(() => User, {
    through: {
      model: () => UserRoleMappings,
    },
  })
  users: User[];

  @CreatedAt public createdAt: Date;

  @UpdatedAt public updatedAt: Date;

  @DeletedAt public deletedAt: Date;
}
