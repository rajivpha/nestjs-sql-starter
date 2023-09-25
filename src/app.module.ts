import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configuration from '@config/configuration';
import { getDataBaseOptions } from '@config/db.config';
import { ContextInterceptor } from '@interceptor/pre/context.interceptor';
import { HttpExceptionHandler } from '@handler/HttpExceptionHandler';
import TransformInterceptor from '@interceptor/TransformInterceptor';
import { HelperModule } from './helpers/helper.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@core/auth/auth.module';
import { UserModule } from '@core/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...getDataBaseOptions(configService),
        models: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    HelperModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionHandler,
    },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
