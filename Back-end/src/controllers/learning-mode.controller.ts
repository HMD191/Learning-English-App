import { Controller, Get, Query } from '@nestjs/common';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { LearningModeService } from '@modules/learning-mode/learning-mode.service';

import { Difficulty } from '@src/constants/constants';
import { capitalizeFirstLetter } from '@src/common/helper';

@Controller('learning-mode')
export class LearningModeController {
  constructor(private readonly learningModeService: LearningModeService) {}

  @Get('complete-sentence-meaning')
  async getFillInTheBlankQuestion(
    @Query('difficulty') difficulty?: string,
  ): Promise<ReturnQuestionAnswerDto> {
    const normalizedDifficulty = capitalizeFirstLetter(
      difficulty ?? Difficulty.Hard,
    );

    const parsedDifficulty =
      Difficulty[normalizedDifficulty as keyof typeof Difficulty] ??
      Difficulty.Hard;

    return await this.learningModeService.getFillInTheBlankQuestion(
      'meaning',
      parsedDifficulty,
    );
  }

  @Get('complete-sentence-word-kind')
  async getFillInTheBlankWordKind(
    @Query('difficulty') difficulty?: string,
  ): Promise<ReturnQuestionAnswerDto> {
    const normalizedDifficulty = capitalizeFirstLetter(
      difficulty ?? Difficulty.Hard,
    );

    const parsedDifficulty =
      Difficulty[normalizedDifficulty as keyof typeof Difficulty] ??
      Difficulty.Hard;

    return await this.learningModeService.getFillInTheBlankQuestion(
      'wordKind',
      parsedDifficulty,
    );
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
