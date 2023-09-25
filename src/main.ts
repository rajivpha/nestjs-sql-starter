import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  global.rootPath = path.resolve(__dirname);

  const NODE_ENV = process.env.NODE_ENV || 'development';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      NODE_ENV === 'development'
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['error', 'warn'],
  });
  const config = app.get<string, any>(ConfigService);
  const { PORT: port, API_PREFIX, APP } = config.internalConfig;

  console.log({ NODE_ENV }, { port });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 422,
      stopAtFirstError: true,
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableVersioning({
    defaultVersion: '1',
    prefix: 'v',
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(API_PREFIX, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle(APP.NAME)
    .setDescription(APP.DESCRIPTION)
    .setVersion(APP.VERSION)
    .addBearerAuth()
    .addTag(APP.TAG)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  console.log(`${APP.SERVICE} listening at:`, port);
  await app.listen(port);
}

bootstrap()
  .then(() => console.info('************STARTED*************'))
  .catch((err) => {
    console.log(err.message);
  });
