import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { OPENAPI_DOCS_PATH } from './configs/open-api.config';
import { buildSwaggerModule } from './shared/utilities/swagger-builder';
import { NodeEnvs } from './configs/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'verbose', 'error', 'log', 'warn'],
  });
  app.setGlobalPrefix('api', { exclude: ['health'] });
  const configService = app.get(ConfigService);
  app.enableCors();

  const API_VERSION = configService.get('API_VERSION');
  const NODE_ENV = configService.get('NODE_ENV');
  const port = configService.get('port');

  app.setGlobalPrefix(`api/${API_VERSION}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  const isDevelopmentOrQaEnvironment = NODE_ENV !== NodeEnvs.production;

  if (isDevelopmentOrQaEnvironment) {
    const document = await buildSwaggerModule(app);
    SwaggerModule.setup(OPENAPI_DOCS_PATH, app, document);
  }

  await app.listen(port);
}
bootstrap();
