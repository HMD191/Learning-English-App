import { Module } from '@nestjs/common';
import { ExternalAIModelService } from './external-AI-model.service';

@Module({
  providers: [ExternalAIModelService],
  exports: [ExternalAIModelService],
})
export class ExternalAIModelModule {}
