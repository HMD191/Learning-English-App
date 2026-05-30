import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { Repository } from 'typeorm';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { Difficulty } from '@constants/constants';
import { capitalizeFirstLetter } from '@src/common/helper';
import { ExternalAIModelService } from '../external-AI-model/external-AI-model.service';
import {
  getPromptMeaningChoice,
  getPromptWordKindChoice,
} from '../external-AI-model/external-AI-model.prompt';

Injectable();
export class LearningModeService {
  constructor(
    @InjectRepository(Words)
    private readonly wordRepository: Repository<Words>,
    private readonly externalAIModelService: ExternalAIModelService,
  ) {}

  async getFillInTheBlankQuestion(
    promptOption: 'meaning' | 'wordKind',
    difficulty: Difficulty = Difficulty.Hard,
    categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    console.log('difficulty:', difficulty);
    const queryBuilder = this.wordRepository.createQueryBuilder('words');

    if (categories && categories.length > 0) {
      queryBuilder
        .leftJoin('words.category', 'category')
        .where('category.categoryName IN (:...categories)', {
          categories: categories.map((c) => capitalizeFirstLetter(c)),
        });
    }

    const word = await queryBuilder.orderBy('RANDOM()').getOne();

    console.log('Selected word:', word?.engMeaning);
    if (!word) {
      console.log('No words available for categories: ', categories);
      throw new Error('No words available for current categories');
    }

    let prompt: string;
    if (promptOption === 'meaning') {
      console.log('Using meaning choice prompt');
      prompt = getPromptMeaningChoice(word.engMeaning, difficulty);
    } else {
      console.log('Using word kind choice prompt');
      prompt = getPromptWordKindChoice(word.engMeaning, difficulty);
    }

    try {
      const result =
        await this.externalAIModelService.getQuestionAndAnswerFromModel(prompt);
      return result;
    } catch (error) {
      console.error('Error getting question and answer from model:', error);
      throw new Error('Failed to get question and answer from model.');
    }
  }

  async mutiChoiceEn2Vn(
    categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    const queryBuilder = this.wordRepository.createQueryBuilder('words');

    if (categories && categories.length > 0) {
      queryBuilder
        .leftJoinAndSelect('words.category', 'category')
        .where('category.categoryName IN (:...categories)', {
          categories: categories.map((c) => capitalizeFirstLetter(c)),
        });
    }

    const chosenWord = await queryBuilder.orderBy('RANDOM()').getOne();

    if (!chosenWord) {
      console.log('No words available for categories: ', categories);
      throw new Error('No words available for current categories');
    }

    const engChosenWord = chosenWord.engMeaning;
    const vnChosenWord = chosenWord.vnMeaning;

    const words = await this.wordRepository
      .createQueryBuilder('words')
      .where('words.engMeaning != :engWord', { engWord: engChosenWord })
      .orderBy('RANDOM()')
      .limit(3)
      .getMany();

    if (words.length < 3) {
      console.log(
        'Not enough words available for categories to learn: ',
        categories,
      );
      throw new Error(
        'Not enough words available for current categories to learn.',
      );
    }

    let vnWords = words.map((word) => word.vnMeaning);
    vnWords = [vnChosenWord, ...vnWords];
    vnWords.sort(() => Math.random() - 0.5);

    const rightAnswerIndex = vnWords.indexOf(vnChosenWord);

    console.log('Selected English word:', engChosenWord);
    console.log('Vietnamese words:', vnWords);
    console.log('Right answer:', ['a', 'b', 'c', 'd'][rightAnswerIndex]);

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: `Find the word with the same meaning as: '${engChosenWord}'`,
        answerOptions: vnWords,
        rightAnswer: ['a', 'b', 'c', 'd'][rightAnswerIndex],
      },
    };
  }

  async mutiChoiceVn2En(
    categories?: string[],
  ): Promise<ReturnQuestionAnswerDto> {
    const queryBuilder = this.wordRepository.createQueryBuilder('words');

    if (categories && categories.length > 0) {
      queryBuilder
        .leftJoinAndSelect('words.category', 'category')
        .where('category.categoryName IN (:...categories)', {
          categories: categories.map((c) => capitalizeFirstLetter(c)),
        });
    }

    const chosenWord = await queryBuilder.orderBy('RANDOM()').getOne();

    if (!chosenWord) {
      console.log('No words available for categories: ', categories);
      throw new Error('No words available for current categories');
    }

    const vnChosenWord = chosenWord.vnMeaning;
    const engChosenWord = chosenWord.engMeaning;

    const words = await this.wordRepository
      .createQueryBuilder('words')
      .where('words.engMeaning != :engWord', { engWord: engChosenWord })
      .orderBy('RANDOM()')
      .limit(3)
      .getMany();

    if (words.length < 3) {
      console.log('No words available for categories: ', categories);
      throw new Error('No words available for current categories');
    }

    let engWords = words.map((word) => word.engMeaning);
    engWords = [engChosenWord, ...engWords];
    engWords.sort(() => Math.random() - 0.5);

    const rightAnswerIndex = engWords.indexOf(engChosenWord);

    console.log('Selected Vietnamese word:', vnChosenWord);
    console.log('English words:', engWords);
    console.log('Right answer:', ['a', 'b', 'c', 'd'][rightAnswerIndex]);

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: `Tìm từ có cùng nghĩa: '${vnChosenWord}'`,
        answerOptions: engWords,
        rightAnswer: ['a', 'b', 'c', 'd'][rightAnswerIndex],
      },
    };
  }

  async completeWord(categories?: string[]): Promise<ReturnQuestionAnswerDto> {
    const queryBuilder = this.wordRepository.createQueryBuilder('words');

    console.log('categories:', categories);

    if (categories && categories.length > 0) {
      queryBuilder
        .leftJoinAndSelect('words.category', 'category')
        .where('category.categoryName IN (:...categories)', {
          categories: categories.map((c) => capitalizeFirstLetter(c)),
        });
    }

    const word = await queryBuilder.orderBy('RANDOM()').getOne();

    if (!word) {
      console.log('No words available for categories: ', categories);
      throw new Error('No words available for current categories');
    }

    word.engMeaning = word.engMeaning.toLowerCase();

    const characters = word.engMeaning
      .split('')
      .sort(() => Math.random() - 0.5);

    console.log('characters:', characters);

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: `${word.vnMeaning}`,
        answerOptions: characters,
        rightAnswer: word.engMeaning,
      },
    };
  }
}
