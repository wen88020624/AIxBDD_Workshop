import { Entity, Column, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

/**
 * 問候實體，記錄使用者的問候資訊
 */
@Entity('greeting')
export class Greeting {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  content: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;

  constructor(id: string, content: string, name: string, createdAt: Date) {
    this.id = id;
    this.content = content;
    this.name = name;
    this.createdAt = createdAt;
    this.validateInvariants();
  }

  /**
   * 驗證不變條件
   * @throws Error 若不變條件被違反
   */
  @BeforeInsert()
  @BeforeUpdate()
  private validateInvariants() {
    if (this.name && this.name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
  }
}
