import { Inject, Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ReturnQuestionAnswerDto } from '@src/dtos/return-message.dto';
import { ConfigService } from '@nestjs/config';
import { getPromptEvaluateWordDifficulty } from './external-AI-model.prompt';

Injectable();
export class ExternalAIModelService {
  private ai: GoogleGenAI;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GOOGLE_GENAI_API_KEY'),
    });
  }

  async getQuestionAndAnswerFromModel(
    prompt: string,
  ): Promise<ReturnQuestionAnswerDto> {
    console.log('Requesting AI model for data');

    const response = await this.ai.models.generateContent({
      model:
        this.configService.get<string>('GOOGLE_GENAI_MODEL') ||
        'gemini-2.5-flash',
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

    if (!sentence.length || !answerOptions.length || !rightAnswer.length) {
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

  async getEvaluateWordDifficultyFromModel(
    word: string,
  ): Promise<{ score: string }> {
    const prompt = getPromptEvaluateWordDifficulty(word);
    try {
      const response = await this.ai.models.generateContent({
        model:
          this.configService.get<string>('GOOGLE_GENAI_MODEL') ||
          'gemini-2.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
        },
      });
      console.log(`difficulty of word "${word}" is ${response.text}`);
      return { score: response.text ?? '0' };
    } catch (error) {
      console.error('Error evaluating word difficulty:', error);
      throw error;
    }
  }
}
