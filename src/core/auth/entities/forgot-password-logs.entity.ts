import { DataTypes } from 'sequelize';
import {
  Column,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'forgot_password_logs',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export default class ForgotPassword extends Model {
  @Column({ primaryKey: true, allowNull: false, autoIncrement: true })
  id: number;

  @Column({ allowNull: false, type: DataTypes.STRING })
  otp: string;

  @Column({ allowNull: false, type: DataTypes.STRING })
  userId: string;

  @Column({ allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false })
  isActive: boolean;

  @CreatedAt public createdAt: Date;

  @UpdatedAt public updatedAt: Date;

  @DeletedAt public deletedAt: Date;
}
