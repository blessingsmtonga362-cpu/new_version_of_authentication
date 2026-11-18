import {
  Body,
  Controller,
  Post,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Public,
  SignInService,
  EmailVerificationService,
} from '@nestjs/authentication';
import { CredentialsService } from './credintial.service.js';
import { SignUpDto, SignInDto } from './dto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly signInService: SignInService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    // Register the user and save their hashed password.
    const user = await this.credentialsService.register(
      body.email,
      body.password,
    );

    // Automatically create a session after successful registration.
    await this.signInService.signIn(user.id, {
      method: 'password',
    });

    // Send the email verification link.
    await this.emailVerificationService.send(user);

    return user;
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() body: SignInDto) {
    const user = await this.credentialsService.verify(
      body.email,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { session } = await this.signInService.signIn(user.id, {
      method: 'password',
    });

    return {
      mfaRequired: session.mfa === 'pending',
    };
  }
}
