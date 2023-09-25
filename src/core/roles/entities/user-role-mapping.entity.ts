import User from '@src/core/user/entities/user.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Role from './role.entity';

@Table({
  tableName: 'user_role_mappings',
  timestamps: true,
  underscored: true,
})
export default class UserRoleMappings extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ allowNull: false, type: DataType.STRING })
  @ForeignKey(() => User)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Role)
  @Column({ allowNull: false, type: DataType.STRING })
  roleId: string;

  @BelongsTo(() => Role)
  role: Role;
}
