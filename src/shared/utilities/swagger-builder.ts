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
import { TourModule } from '@/tour/tour.module';
import { PrivatetourModule } from '@/privatetour/privatetour.module';
import { PassengerModule } from '@/passenger/passenger.module';
import { SalerModule } from '@/saler/saler.module';
import { SalesModule } from '@/sales/sales.module';
import { PriceModule } from '@/price/price.module';
import { DestinationModule } from '@/destination/destination.module';
import { IncludedModule } from '@/included/included.module';
import { ItineraryModule } from '@/itinerary/itinerary.module';
import { DepartureModule } from '@/departure/departure.module';

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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(scopedApplicationCore, config, {
    include: [
      UserModule,
      RolesModule,
      OrigincityModule,
      AboardpointModule,
      CaptionsModule,
      CategoryModule,
      TourModule,
      PrivatetourModule,
      PassengerModule,
      SalerModule,
      SalesModule,
      PriceModule,
      DestinationModule,
      IncludedModule,
      ItineraryModule,
      DepartureModule,
    ],
  });

  return document;
};
