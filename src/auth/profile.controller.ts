import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';

import type { User } from '../user/user.js';

@Controller('me')
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}
