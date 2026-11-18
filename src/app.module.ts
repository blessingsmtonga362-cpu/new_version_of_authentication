import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module.js';
import {
  MailModule,
  FileTemplateEngine,
  LogMailTransport,
  SmtpTransport,
} from '@nestjs/mail';
import { join } from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    MailModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const smtpUrl = config.get<string>('SMTP_URL');

        return {
          transport: smtpUrl
            ? new SmtpTransport({ url: smtpUrl })
            : new LogMailTransport(),

          templates: new FileTemplateEngine({
            dir: join(__dirname, 'mail/templates'),
          }),

          from: `Accounts <${config.get<string>('SMTP_USER')}>`,
        };
      },
    }),

    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        emailVerification: {
          url: `${config.getOrThrow<string>('APP_URL')}/verify-email`,
        },
        passwordReset: {
          url: `${config.getOrThrow<string>('APP_URL')}/reset-password`,
        },
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'https://api.example.com',
          audience: 'mobile-app',
          ttl: '15m',
        },
        mfa: {
          issuer: 'Mtonga Authentication API',
          encryption: {
            keys: [config.getOrThrow<string>('TOTP_ENCRYPTION_KEY')],
          },
        },
      }),
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
