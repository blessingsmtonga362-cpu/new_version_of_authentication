import { UserEntity } from './entities/user.entity.js';

export type User = Pick<
  UserEntity,
  'id' | 'email' | 'emailVerified' | 'roles' | 'createdAt'
>;
