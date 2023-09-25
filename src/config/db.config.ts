import { ConfigService } from '@nestjs/config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
let _connection;

export const getDataBaseOptions = (configService: ConfigService): SequelizeOptions => {
  const CONSTANTS = configService.get('DB');
  return {
    dialect: 'mysql',
    host: CONSTANTS.HOST,
    port: parseInt(CONSTANTS.PORT) || 3306,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
    username: CONSTANTS.USERNAME,
    password: CONSTANTS.PASSWORD,
    database: CONSTANTS.DATABASE,
    logging: (sql, timing) => {
      // Custom logging function
      console.log(`Executing SQL: ${sql}`);
      console.log(`Execution time: ${timing}ms`);
    },
    // timezone: CONSTANTS.TIMEZONE || 'utc',
  };
};

export const initDatabaseConnection = async (configService: ConfigService) => {
  if (_connection) return _connection;

  const options: SequelizeOptions = getDataBaseOptions(configService);
  console.log(options);

  _connection = new Sequelize(options);
  return _connection;
};

export const getDatabaseConnection = () => {
  if (!_connection) {
    console.error('Database not initialized.');
  }
  return _connection;
};
