import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { WordController } from '@src/controllers/word.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Words])],
  exports: [WordService],
  providers: [WordService],
  controllers: [WordController],
})
export class WordModule {}
