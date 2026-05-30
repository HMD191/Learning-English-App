import { Module } from '@nestjs/common';
import { LearningModeService } from './learning-mode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { LearningModeController } from '@controllers/learning-mode.controller';
import { ExternalAIModelModule } from '../external-AI-model/external-AI-model.module';

@Module({
  imports: [TypeOrmModule.forFeature([Words]), ExternalAIModelModule],
  providers: [LearningModeService],
  exports: [LearningModeService],
  controllers: [LearningModeController],
})
export class LearningModeModule {}
