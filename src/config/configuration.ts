require('dotenv').config();
export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 5001,
  API_PREFIX: '/api',
  APP: {
    NAME: 'Nest Js SQL Starter',
    DESCRIPTION: '',
    SERVICE: 'Starter Service',
    VERSION: '1.0',
    TAG: 'starter',
  },
  DB: {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET_KEY || 'secret',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret',
  },
});
