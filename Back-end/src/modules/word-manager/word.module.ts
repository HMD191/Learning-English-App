import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Words])],
  exports: [WordService],
  providers: [WordService],
})
export class WordModule {}
