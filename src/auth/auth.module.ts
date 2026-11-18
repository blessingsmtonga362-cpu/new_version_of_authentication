import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { CredentialsService } from './credintial.service.js';
import { AuthController } from './auth.controller.js';
import { SessionAuth } from './session-auth.provider.js';
import { EmailVerificationMailer } from './email-verification.mailer.js';
import { EmailVerificationController } from './email-verification.controller.js';
import { PasswordResetMailer } from './password-reset.mailer.js';
import { PasswordResetController } from './password-reset.controller.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { TokensController } from './tokens.controller.js';
import { ProfileController } from './profile.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailTokenEntity,
  MagicLinkEntity,
  MfaAuthenticatorEntity,
  MfaFailureEntity,
  MfaRecoveryCodeEntity,
  OidcLoginEntity,
  RefreshTokenEntity,
  SessionEntity,
} from '../typeorm/authentication.entities.js';
import { TypeOrmAuthenticationStore } from '../typeorm/typeorm-authentication.store.js';
import { SessionsController } from './sessions.controller.js';
import { MfaController } from './mfa.controller.js';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      EmailTokenEntity,
      MagicLinkEntity,
      MfaAuthenticatorEntity,
      MfaFailureEntity,
      MfaRecoveryCodeEntity,
      OidcLoginEntity,
      RefreshTokenEntity,
      SessionEntity,
    ]),
  ],
  controllers: [
    AuthController,
    EmailVerificationController,
    PasswordResetController,
    TokensController,
    ProfileController,
    SessionsController,
    MfaController,
  ],
  providers: [
    CredentialsService,
    SessionAuth,
    EmailVerificationMailer,
    PasswordResetMailer,
    JwtAuth,
    TypeOrmAuthenticationStore,
  ],
  exports: [CredentialsService, SessionAuth],
})
export class AuthModule {}
