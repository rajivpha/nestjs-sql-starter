import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
  DeletedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Role from '@src/core/roles/entities/role.entity';
import UserRoleMappings from '@src/core/roles/entities/user-role-mapping.entity';

@Table({ tableName: 'users', timestamps: true, underscored: true, paranoid: true })
export default class User extends Model {
  @ApiProperty()
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false, type: DataTypes.STRING })
  firstName: string;

  @Column({ allowNull: true })
  middleName: string;

  @Column({ allowNull: false, type: DataTypes.STRING })
  lastName: string;

  @Column(DataType.VIRTUAL)
  get fullName() {
    let fullName = ``;
    if (this.getDataValue('firstName')) fullName += this.getDataValue('firstName');

    if (this.getDataValue('middleName')) fullName += this.getDataValue('middleName');

    if (this.getDataValue('lastName')) fullName += ` ${this.getDataValue('lastName')}`;

    return fullName;
  }

  @Column({ allowNull: false, type: DataTypes.STRING })
  email: string;

  @ApiHideProperty()
  @Column({ allowNull: false, type: DataTypes.STRING })
  password: string;

  @Column({ allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false })
  isVerified: boolean;

  @Column({ allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false })
  isActive: boolean;

  @Column({ allowNull: true, type: DataTypes.STRING })
  profilePicUrl: string;

  @BelongsToMany(() => Role, {
    through: {
      model: () => UserRoleMappings,
    },
  })
  userRole: Role[];

  @CreatedAt public createdAt: Date;

  @UpdatedAt public updatedAt: Date;

  @DeletedAt public deletedAt: Date;
}
