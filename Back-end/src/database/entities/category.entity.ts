import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Words } from './word.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @OneToMany(() => Words, (word) => word.category, {
    cascade: true,
  })
  words: Words[];

  @Column({
    name: 'category_name',
    type: 'varchar',
    unique: true,
    length: 255,
  })
  categoryName: string;

  @Column({
    name: 'last_update',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;
}
