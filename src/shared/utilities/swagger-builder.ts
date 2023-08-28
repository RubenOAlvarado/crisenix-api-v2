import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import {
  OPENAPI_DESCRIPTION,
  OPENAPI_TITLE,
} from 'src/configs/open-api.config';
import { UserModule } from 'src/user/user.module';
import { Config } from '../interfaces/config.interface';
import { RolesModule } from 'src/roles/roles.module';
import { OrigincityModule } from 'src/origincity/origincity.module';
import { AboardpointModule } from 'src/aboardpoint/aboardpoint.module';
import { CaptionsModule } from '@/captions/captions.module';
import { CategoryModule } from '@/category/category.module';

export const buildSwaggerModule = async (
  applicationCore?: INestApplication,
): Promise<OpenAPIObject> => {
  const scopedApplicationCore =
    applicationCore || (await NestFactory.create(AppModule));
  const configService: ConfigService<Config | unknown, true> =
    scopedApplicationCore.get(ConfigService);

  const VERSION = configService.get('VERSION');

  const config = new DocumentBuilder()
    .setTitle(OPENAPI_TITLE)
    .setDescription(OPENAPI_DESCRIPTION)
    .setVersion(VERSION)
    .build();

  const document = SwaggerModule.createDocument(scopedApplicationCore, config, {
    include: [
      UserModule,
      RolesModule,
      OrigincityModule,
      AboardpointModule,
      CaptionsModule,
      CategoryModule,
    ],
  });

  return document;
};
