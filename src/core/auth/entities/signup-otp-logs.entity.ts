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
  tableName: 'signup_otp_logs',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export default class SignupOtpLogs extends Model {
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
