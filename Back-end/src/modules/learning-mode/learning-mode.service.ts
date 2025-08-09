import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { Repository } from 'typeorm';
import { ReturnQuestionAnswerDto } from '@dtos/return-message.dto';
import { Difficulty } from '@constants/constants';
import { GoogleGenAI } from '@google/genai';

Injectable();
export class LearningModeService {
  private ai: GoogleGenAI;
  constructor(
    @InjectRepository(Words)
    private wordRepository: Repository<Words>,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });
  }

  getPromptMeaningChoice(word: Words, difficulty: Difficulty): string {
    return `Generate a sentence with a blank ("___" present for blank) and 4 random answer options, where the true answer to fill in the blank must be exactly the word "${word.engMeaning.toLowerCase()}". 
    The sentence should be suitable for ${difficulty} level.
    Generate an explanation in vietnamese for correct answer.
    Follow the format below strictly:
    Sentence: <sentence here>
    a: <option 1>
    b: <option 2>
    c: <option 3>
    d: <option 4>
    RightAnswer: <correct option letter> (e.g., a, b, c, or d)
    Explanation: <explanation for the correct answer in vietnamese>
    `;
  }

  getPromptWordKindChoice(word: Words, difficulty: Difficulty): string {
    return `Generate a sentence that includes a blank ("___") to be filled. Generate four random answer options corresponding to 4 different kinds: a noun, a verb, an adjective, and an adverb which based on the word "${word.engMeaning.toLowerCase()}" (include original word).
    The options must be different from each other in spelling and must not be labeled with their word kinds.
    If distractors cannot be generated enough from the word "${word.engMeaning.toLowerCase()}", use unrelated words that fit the required parts of speech.
    The sentence should be suitable for ${difficulty} level. 
    Generate an explanation in vietnamese for correct answer.
    Follow the format below strictly:
    Sentence: <sentence here>
    a: <option 1>
    b: <option 2>
    c: <option 3>
    d: <option 4>
    RightAnswer: <correct option letter> (e.g., a, b, c, or d)
    Explanation: <explanation for the correct answer in vietnamese>
    `;
  }

  async getFillInTheBlankQuestion(
    promptOption: 'meaning' | 'wordKind',
    difficulty: Difficulty = Difficulty.Hard,
  ): Promise<ReturnQuestionAnswerDto> {
    console.log('difficulty:', difficulty);
    const word = await this.wordRepository
      .createQueryBuilder('words')
      .orderBy('RANDOM()')
      .getOne();

    console.log('Selected word:', word?.engMeaning);
    if (!word) {
      throw new Error('No words available for learning mode.');
    }

    let prompt: string;
    if (promptOption === 'meaning') {
      console.log('Using meaning choice prompt');
      prompt = this.getPromptMeaningChoice(word, difficulty);
    } else {
      console.log('Using word kind choice prompt');
      prompt = this.getPromptWordKindChoice(word, difficulty);
    }

    try {
      const result = await this.getQuestionAndAnswerFromModel(prompt);
      return result;
    } catch (error) {
      console.error('Error getting question and answer from model:', error);
      throw new Error('Failed to get question and answer from model.');
    }
  }

  async getQuestionAndAnswerFromModel(
    prompt: string,
  ): Promise<ReturnQuestionAnswerDto> {
    console.log('Requesting AI model for data');

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    const content: string = response.text ?? '';

    console.log('AI response content:', content);

    let sentence: string = '';
    const answerOptions: string[] = [];
    let rightAnswer: string = '';

    content.split('\n').map((line: string) => {
      line = line.trim();
      if (line.startsWith('Sentence:')) {
        sentence = line.replace('Sentence:', '').trim();
      } else if (line.startsWith('RightAnswer:')) {
        rightAnswer = line.replace('RightAnswer:', '').trim();
      } else if (/^[a-d]:/.test(line) && answerOptions.length < 4) {
        const option = line.split(':')[1].trim();
        answerOptions.push(option);
      }
    });

    const explanation = content.split('Explanation:')[1]?.trim();

    console.log('sentence:', sentence);
    console.log('Answer Options:', answerOptions);
    console.log('Right Answer:', rightAnswer);
    console.log('Explanation:', explanation);

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
        explanation: explanation,
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
    console.log('Right answer:', options[randomIdx]);

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
    console.log('Right answer:', options[randomIdx]);

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
