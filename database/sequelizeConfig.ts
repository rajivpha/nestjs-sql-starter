module.exports = {
  development: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'temp123',
    database: process.env.DB_DATABASE || 'nestjs_sql_starter',
    underscored: true, // This is important

    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 60000,
    },
  },
  local: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'temp123',
    database: process.env.DB_DATABASE || 'nestjs_sql_starter',
    pool: {
      max: parseInt(process.env.MAX_DB_CONNECTION),
      min: parseInt(process.env.MIN_DB_CONNECTION),
      acquire: 60000,
    },
    timezone: '+00:00',
  },
};
