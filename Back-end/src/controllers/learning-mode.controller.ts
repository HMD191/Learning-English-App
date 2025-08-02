import { Controller, Get } from '@nestjs/common';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { LearningModeService } from '@modules/learning-mode/learning-mode.service';
import { get } from 'http';

@Controller('learning-mode')
export class LearningModeController {
  constructor(private readonly learningModeService: LearningModeService) {}

  @Get('complete-sentence-meaning')
  async getFillInTheBlankQuestion(): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.getFillInTheBlankQuestion('meaning');
  }

  @Get('complete-sentence-word-kind')
  async getFillInTheBlankWordKind(): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.getFillInTheBlankQuestion('wordKind');
  }

  @Get('1Eng-4Vn-words')
  async get1Eng4VnWords(): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.get1Eng4VnWords();
  }

  @Get('1Vn-4Eng-words')
  async get1Vn4EngWords(): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.get1Vn4EngWords();
  }

  @Get('complete-word')
  async completeWord(): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.completeWord();
  }
}
