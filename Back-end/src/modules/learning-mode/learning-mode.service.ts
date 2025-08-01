import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { Repository } from 'typeorm';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { Difficulty } from '@constants/constants';

Injectable();
export class LearningModeService {
  constructor(
    @InjectRepository(Words)
    private wordRepository: Repository<Words>,
  ) {}

  async getFillInTheBlankQuestion(
    difficulty: Difficulty = Difficulty.Hard,
  ): Promise<ReturnQuestionAnswerDto> {
    const word = await this.wordRepository
      .createQueryBuilder('words')
      .orderBy('RANDOM()')
      .getOne();

    console.log('Selected word:', word?.engMeaning);
    if (!word) {
      throw new Error('No words available for learning mode.');
    }

    try {
      const result = await this.getQuestionAndAnswerFromModel(word, difficulty);
      return result;
    } catch (error) {
      console.error('Error getting question and answer from model:', error);
      throw new Error('Failed to get question and answer from model.');
    }
  }

  async getQuestionAndAnswerFromModel(
    word: Words,
    difficulty: Difficulty,
  ): Promise<ReturnQuestionAnswerDto> {
    // const wordKind =
    //   word.wordKind[Math.floor(Math.random() * word.wordKind.length)];
    // The sentence should be clear and suitable for an English learning application.
    // Given the word: "${word.engMeaning}".
    const prompt = `Generate a sentence with a blank ("___"present for blank) and 4 random answer options, where the true answer to fill in the blank is "${word.engMeaning.toLowerCase()}". The sentence should be suitable for ${difficulty} level.
    Follow the format below strictly:
    Sentence: <sentence here>
    a: <option 1>
    b: <option 2>
    c: <option 3>
    d: <option 4>
    RightAnswer: <correct option> (ex: a, b, c, or d)
    `;
    const data = {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'google/gemma-2-2b-it:nebius',
    };

    console.log('Requesting AI model for data');

    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    const content: string = result.choices[0].message.content;

    let sentence: string = '';
    const answerOptions: string[] = [];
    let rightAnswer: string = '';

    content.split('\n').map((line: string) => {
      line = line.trim();
      if (line.startsWith('Sentence:')) {
        sentence = line.replace('Sentence:', '').trim();
      } else if (line.startsWith('RightAnswer:')) {
        rightAnswer = line.replace('RightAnswer:', '').trim();
      } else if (/^[a-d][:)]/.test(line)) {
        const option = line.split(':')[1].trim();
        answerOptions.push(option);
      }
    });

    console.log('sentence:', sentence);
    console.log('Answer Options:', answerOptions);
    console.log('Right Answer:', rightAnswer);

    if (!sentence.length || !answerOptions.length || !rightAnswer.length) {
      // return {
      //   statusCode: 500,
      // };
      throw new Error(
        'Failed to generate a valid question and answer from the model.',
      );
    }

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: sentence,
        answerOptions: answerOptions,
        rightAnswer: rightAnswer,
      },
    };
  }

  async get1Eng4VnWords(): Promise<ReturnQuestionAnswerDto> {
    const words = await this.wordRepository
      .createQueryBuilder('words')
      .orderBy('RANDOM()')
      .limit(4)
      .getMany();

    if (words.length < 4) {
      throw new Error('Not enough words available for learning mode.');
    }

    const options = ['a', 'b', 'c', 'd'];
    const randomIdx = Math.floor(Math.random() * words.length);

    const engWord = words[randomIdx].engMeaning;
    const vnWords = words.map(
      (word) => word.vnMeaning[0].toUpperCase() + word.vnMeaning.slice(1),
    );

    console.log('Selected English word:', engWord);
    console.log('Vietnamese words:', vnWords);
    console.log('Right answer index:', randomIdx);

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: `Find the word with the same meaning as: '${engWord}'`,
        answerOptions: vnWords,
        rightAnswer: options[randomIdx],
      },
    };
  }

  async get1Vn4EngWords(): Promise<ReturnQuestionAnswerDto> {
    const words = await this.wordRepository
      .createQueryBuilder('words')
      .orderBy('RANDOM()')
      .limit(4)
      .getMany();

    if (words.length < 4) {
      throw new Error('Not enough words available for learning mode.');
    }

    const options = ['a', 'b', 'c', 'd'];
    const randomIdx = Math.floor(Math.random() * words.length);

    const vnWord =
      words[randomIdx].vnMeaning[0].toUpperCase() +
      words[randomIdx].vnMeaning.slice(1);
    const engWords = words.map(
      (word) => word.engMeaning[0].toUpperCase() + word.engMeaning.slice(1),
    );

    console.log('Selected Vietnamese word:', vnWord);
    console.log('English words:', engWords);
    console.log('Right answer index:', randomIdx);

    return {
      statusCode: 200,
      questionAnswer: {
        sentence: `Tìm từ có cùng nghĩa: '${vnWord}'`,
        answerOptions: engWords,
        rightAnswer: options[randomIdx],
      },
    };
  }

  async completeWord(): Promise<ReturnQuestionAnswerDto> {
    const word = await this.wordRepository
      .createQueryBuilder('words')
      .orderBy('RANDOM()')
      .getOne();

    if (!word) {
      throw new Error('No words available for completion.');
    }

    word.engMeaning = word.engMeaning.toLowerCase();

    const characters = word.engMeaning
      .split('')
      .sort(() => Math.random() - 0.5);

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
