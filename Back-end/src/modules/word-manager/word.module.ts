import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { WordController } from '@src/controllers/word.controller';
import { CategoryService } from './category.service';
import { Categories } from '@src/database/entities/category.entity';
import { ExternalAIModelModule } from '../external-AI-model/external-AI-model.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Words, Categories]),
    ExternalAIModelModule,
  ],
  exports: [WordService, CategoryService],
  providers: [WordService, CategoryService],
  controllers: [WordController],
})
export class WordModule {}
