import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WordKind } from '@constants/constants';
import { Categories } from './category.entity';

@Entity()
export class Words {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne(() => Categories, (category) => category.words, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Categories;

  @Column({
    name: 'eng_meaning',
    type: 'varchar',
    unique: true,
    length: 255,
  })
  engMeaning: string;

  @Column({
    name: 'vn_meaning',
    type: 'varchar',
    length: 255,
  })
  vnMeaning: string;

  @Column({
    name: 'word_kind',
    type: 'enum',
    enum: WordKind,
    array: true,
  })
  wordKind: WordKind[];

  @Column({
    name: 'metadata',
    default: null,
    type: 'json',
    nullable: true,
  })
  metadata: Record<string, any>;

  @Column({
    name: 'last_update',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;
}
