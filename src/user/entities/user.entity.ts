import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  passwordHash: string | null;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({
    type: 'text',
    array: true,
    default: () => "ARRAY['user']::text[]",
  })
  roles: string[];
  @CreateDateColumn()
  createdAt: Date;
}
