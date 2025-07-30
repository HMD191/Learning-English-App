import { Controller, Get } from '@nestjs/common';
import { returnQuestionAnswerDto } from '@dtos/return-message.dto';
import { LearningModeService } from '@modules/learning-mode/learning-mode.service';

@Controller('learning-mode')
export class LearningModeController {
  constructor(private readonly learningModeService: LearningModeService) {}

  @Get('fill-in-the-blank-question')
  async getFillInTheBlankQuestion(): Promise<returnQuestionAnswerDto> {
    return await this.learningModeService.getFillInTheBlankQuestion();
  }

  @Get('1Eng-4Vn-words')
  async get1Eng4VnWords(): Promise<returnQuestionAnswerDto> {
    return await this.learningModeService.get1Eng4VnWords();
  }

  @Get('1Vn-4Eng-words')
  async get1Vn4EngWords(): Promise<returnQuestionAnswerDto> {
    return await this.learningModeService.get1Vn4EngWords();
  }

  @Get('complete-word')
  async completeWord(): Promise<returnQuestionAnswerDto> {
    return await this.learningModeService.completeWord();
  }
}
