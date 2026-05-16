import { Module } from '@nestjs/common';
import { LearningModeService } from './learning-mode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { LearningModeController } from '@controllers/learning-mode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Words])],
  providers: [LearningModeService],
  exports: [LearningModeService],
  controllers: [LearningModeController],
})
export class LearningModeModule {}
