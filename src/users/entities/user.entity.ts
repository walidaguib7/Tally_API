import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ nullable: false })
  passwordHash: string;
  @Column({ default: false })
  isVerified: boolean;
  @Column('text', { array: true })
  roles: string[];
}
