import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity.js';
import { User } from './user.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email: this.normalizeEmail(email) },
    });

    return user ? this.toUser(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    return user ? this.toUser(user) : null;
  }

  async create(
    email: string,
    additionalData: Partial<UserEntity> = {},
  ): Promise<User> {
    const user = this.repository.create({
      ...additionalData,
      email: this.normalizeEmail(email),
    });

    const savedUser = await this.repository.save(user);

    return this.toUser(savedUser);
  }

  private normalizeEmail(email: string): string {
    return email.trim().normalize('NFC').toLowerCase();
  }

  private toUser(user: UserEntity): User {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      roles: user.roles,
      createdAt: user.createdAt,
    };
  }

  async findCredentials(email: string): Promise<{
    user: User;
    passwordHash: string | null;
  } | null> {
    const entity = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', {
        email: this.normalizeEmail(email),
      })
      .getOne();

    if (!entity) {
      return null;
    }

    return {
      user: this.toUser(entity),
      passwordHash: entity.passwordHash,
    };
  }

  async markEmailVerified(userId: string, email: string): Promise<boolean> {
    const result = await this.repository.update(
      {
        id: userId,
        email: this.normalizeEmail(email),
      },
      {
        emailVerified: true,
      },
    );

    return (result.affected ?? 0) > 0;
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await this.repository.update(
      { id: userId },
      { passwordHash },
    );

    return (result.affected ?? 0) > 0;
  }
}
