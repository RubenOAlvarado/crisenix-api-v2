import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AboardpointModule } from './aboardpoint/aboardpoint.module';
import { CaptionsModule } from './captions/captions.module';
import { CategoryModule } from './category/category.module';
import { ClasificationModule } from './clasification/clasification.module';
import { CommissionsModule } from './commissions/commissions.module';
import { DepartureModule } from './departure/departure.module';
import { IncludedModule } from './included/included.module';
import { OrigincityModule } from './origincity/origincity.module';
import { PassengerModule } from './passenger/passenger.module';
import { PriceModule } from './price/price.module';
import { RolesModule } from './roles/roles.module';
import { SalerModule } from './saler/saler.module';
import { SalertypeModule } from './salertype/salertype.module';
import { TemplatesModule } from './templates/templates.module';
import { TourtypeModule } from './tourtype/tourtype.module';
import { TranslationtypeModule } from './translationtype/translationtype.module';
import { TransportsModule } from './transports/transports.module';
import { DestinationModule } from './destination/destination.module';
import { EventlogModule } from './eventlog/eventlog.module';
import { FilerModule } from './filer/filer.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { MailerModule } from './mailer/mailer.module';
import { PrivatetourModule } from './privatetour/privatetour.module';
import { SalesModule } from './sales/sales.module';
import { TourModule } from './tour/tour.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { firebaseProvider } from './shared/providers/firebase.provider';
import configuration from './configs/configuration';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register(),
    AuthModule,
    AboardpointModule,
    CaptionsModule,
    CategoryModule,
    ClasificationModule,
    CommissionsModule,
    DepartureModule,
    IncludedModule,
    OrigincityModule,
    PassengerModule,
    PriceModule,
    RolesModule,
    SalerModule,
    SalertypeModule,
    TemplatesModule,
    TourtypeModule,
    TranslationtypeModule,
    TransportsModule,
    DestinationModule,
    EventlogModule,
    FilerModule,
    ItineraryModule,
    MailerModule,
    PrivatetourModule,
    SalesModule,
    TourModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, firebaseProvider],
})
export class AppModule {}
