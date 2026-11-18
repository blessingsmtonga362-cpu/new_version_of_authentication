import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from '@nestjs/authentication';
import type { User } from '../user/user.js';
import { UsersRepository } from '../user/user.repository.js';

@Injectable()
export class SessionAuth extends SessionCookieProvider<User> {
  constructor(
    private readonly usersRepository: UsersRepository,
    registry: AuthenticationRegistry,
  ) {
    super();

    // Register this provider with the authentication package.
    registry.registerProvider(this);
  }

  // Called when a request contains a valid session cookie.
  validate(session: SessionRecord) {
    return this.usersRepository.findById(session.userId);
  }
}
