import { Controller, Get, Query } from '@nestjs/common';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { LearningModeService } from '@modules/learning-mode/learning-mode.service';

import { Difficulty } from '@src/constants/constants';
import { capitalizeFirstLetter } from '@src/common/helper';

@Controller('learning')
export class LearningModeController {
  constructor(private readonly learningModeService: LearningModeService) {}

  @Get('fill-in-the-blank/meaning')
  async getFillInTheBlankQuestion(
    @Query('difficulty') difficulty?: string,
    @Query('categories') categories?: string[],
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
      categories,
    );
  }

  @Get('fill-in-the-blank/word-kind')
  async getFillInTheBlankWordKind(
    @Query('difficulty') difficulty?: string,
    @Query('categories') categories?: string[],
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
      categories,
    );
  }

  @Get('multiple-choice/eng-to-vn')
  async get1Eng4VnWords(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.get1Eng4VnWords();
  }

  @Get('multiple-choice/vn-to-eng')
  async get1Vn4EngWords(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.get1Vn4EngWords();
  }

  @Get('spelling')
  async completeWord(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    return await this.learningModeService.completeWord();
  }
}
