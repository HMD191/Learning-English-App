import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { WordController } from '@src/controllers/word.controller';
import { CategoryService } from './category.service';
import { Categories } from '@src/database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Words, Categories])],
  exports: [WordService, CategoryService],
  providers: [WordService, CategoryService],
  controllers: [WordController],
})
export class WordModule {}
