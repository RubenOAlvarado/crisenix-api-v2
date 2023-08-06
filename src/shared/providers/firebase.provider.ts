import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeApp, App, cert } from 'firebase-admin/app';

export const firebaseProvider = {
  provide: 'FirebaseConnection',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const GOOGLE_CREDENTIALS = config.get('GOOGLE_CREDENTIALS');

    const app: App = initializeApp({
      credential: cert(
        JSON.parse(Buffer.from(GOOGLE_CREDENTIALS, 'base64').toString()),
      ),
    });

    return app;
  },
};
