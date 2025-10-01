import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Greeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  timestamp: Date;
}
