import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { CurrentUser, MfaService, SignInService } from '@nestjs/authentication';

@Controller('auth/mfa')
export class MfaController {
  constructor(
    private readonly mfaService: MfaService,
    private readonly signInService: SignInService,
  ) {}

  // Start MFA enrollment
  @Post('enroll')
  enroll(@CurrentUser() user: { id: string; email: string }) {
    return this.mfaService.enroll(user.id, user.email);
  }

  // Confirm MFA enrollment
  @Post('confirm')
  @HttpCode(200)
  async confirm(@CurrentUser('id') userId: string, @Body('code') code: string) {
    const verified = await this.signInService.confirmMfa(userId, code);

    if (!verified) {
      throw new UnauthorizedException('Invalid code');
    }

    const recoveryCodes = await this.mfaService.generateRecoveryCodes(userId);

    return { recoveryCodes };
  }
}
