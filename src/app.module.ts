import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AboardpointModule } from './aboardpoint/aboardpoint.module';
import { CaptionsModule } from './captions/captions.module';
import { CategoryModule } from './category/category.module';
import { ClassificationModule } from './classification/classification.module';
import { OrigincityModule } from './origincity/origincity.module';
import { PassengerModule } from './passenger/passenger.module';
import { RolesModule } from './roles/roles.module';
import { TemplatesModule } from './templates/templates.module';
import { TourtypeModule } from './tourtype/tourtype.module';
import { TransportsModule } from './transports/transports.module';
import { DestinationModule } from './destination/destination.module';
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
import { FirebaseAuthStrategy } from './auth/firebase-auth.strategy';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { PricesModule } from './prices/prices.module';
import { ReservationModule } from './reservation/reservation.module';
import { IncludedServicesModule } from './includedServices/includedServices.module';
import { ItineraryActivitiesModule } from './itineraryActivities/itineraryActivities.module';
import { TransportTypeModule } from './transporttype/transporttype.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { EntriesModule } from './entries/entries.module';

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
    ClassificationModule,
    IncludedServicesModule,
    OrigincityModule,
    PassengerModule,
    RolesModule,
    TemplatesModule,
    TourtypeModule,
    TransportTypeModule,
    TransportsModule,
    DestinationModule,
    MailerModule,
    PrivatetourModule,
    SalesModule,
    TourModule,
    UserModule,
    PricesModule,
    ReservationModule,
    ItineraryActivitiesModule,
    FileManagerModule,
    EntriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    firebaseProvider,
    FirebaseAuthStrategy,
    {
      provide: 'APP_GUARD',
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
