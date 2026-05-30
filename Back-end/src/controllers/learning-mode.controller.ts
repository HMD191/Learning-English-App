import { Controller, Get, Query } from '@nestjs/common';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { LearningModeService } from '@modules/learning-mode/learning-mode.service';

import { Difficulty } from '@src/constants/constants';
import { capitalizeFirstLetter, string2Strings } from '@src/common/helper';

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

    categories = string2Strings(categories);

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

    categories = string2Strings(categories);

    return await this.learningModeService.getFillInTheBlankQuestion(
      'wordKind',
      parsedDifficulty,
      categories,
    );
  }

  @Get('multiple-choice/eng-to-vn')
  async mutiChoiceEn2Vn(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    categories = string2Strings(categories);

    return await this.learningModeService.mutiChoiceEn2Vn(categories);
  }

  @Get('multiple-choice/vn-to-eng')
  async mutiChoiceVn2En(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    categories = string2Strings(categories);

    return await this.learningModeService.mutiChoiceVn2En(categories);
  }

  @Get('spelling')
  async completeWord(
    @Query('categories') categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    categories = string2Strings(categories);

    return await this.learningModeService.completeWord(categories);
  }
}
