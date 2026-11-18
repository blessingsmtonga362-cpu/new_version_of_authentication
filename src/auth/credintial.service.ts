import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersRepository } from '../user/user.repository.js';
import { User } from '../user/user.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(email: string, password: string): Promise<User> {
    // 1. Check whether this email already exists.
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the password.
    const passwordHash = await this.passwordHasher.hash(password);

    // 3. Save the user and password hash in PostgreSQL.
    return this.usersRepository.create(email, { passwordHash });
  }
  async verify(email: string, password: string): Promise<User | null> {
    const found = await this.usersRepository.findCredentials(email);

    // PasswordHasher also performs a dummy-hash check when
    // the account or stored password hash is missing.
    const valid = await this.passwordHasher.verify(
      password,
      found?.passwordHash,
    );

    if (!valid || !found?.passwordHash) {
      return null;
    }

    // Only return the safe public user object.
    return found.user;
  }
}
