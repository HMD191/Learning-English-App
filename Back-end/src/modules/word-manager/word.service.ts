import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { WordDto, UpdateWordDto } from '@dtos/word-manager.dto';
import { Repository } from 'typeorm';
import {
  returnStringDto,
  returnWordDto,
  returnWordsDto,
} from '@dtos/return-message.dto';

Injectable();
export class WordService {
  constructor(
    @InjectRepository(Words)
    private wordRepository: Repository<Words>,
  ) {}

  async addWord(wordDto: WordDto): Promise<returnStringDto> {
    wordDto.wordKind.sort();
    wordDto.engMeaning =
      wordDto.engMeaning.charAt(0).toUpperCase() +
      wordDto.engMeaning.slice(1).toLowerCase();

    // check if the word already exists
    const existedWord = await this.wordRepository.findOne({
      where: { engMeaning: wordDto.engMeaning },
    });

    if (existedWord) {
      console.log(`Word "${wordDto.engMeaning}" already exists.`);

      const oldWordKind = existedWord.wordKind;
      wordDto.wordKind = [
        ...new Set([...oldWordKind, ...wordDto.wordKind]),
      ].sort();

      try {
        await this.wordRepository.update(existedWord.id, {
          wordKind: wordDto.wordKind,
          lastUpdate: new Date(),
        });
      } catch (error) {
        console.error('Error updating word kind:', error);
        throw new InternalServerErrorException('Database update failed');
      }

      console.log(
        `Updated word kind for "${wordDto.engMeaning}":`,
        wordDto.wordKind,
      );
      return {
        statusCode: 200,
        message: `Word "${wordDto.engMeaning}" already exists. Updated word kind successfully.`,
      };
    }

    try {
      const newWord = this.wordRepository.create(wordDto);
      console.log(newWord);
      const result = await this.wordRepository.save(newWord);
      if (!result) {
        throw new InternalServerErrorException('Database save failed');
      }

      console.log(`Added new word "${wordDto.engMeaning}" successfully.`);
      return {
        statusCode: 201,
        message: 'Word added successfully!',
      };
    } catch (error) {
      console.error('Error adding word:', error);
      throw new InternalServerErrorException('Database save failed');
    }
  }

  async updateWord(wordDto: UpdateWordDto): Promise<returnStringDto> {
    console.log('Updating word:', wordDto);
    wordDto.engMeaning =
      wordDto.engMeaning.charAt(0).toUpperCase() +
      wordDto.engMeaning.slice(1).toLowerCase();

    const existedWord = await this.wordRepository.findOne({
      where: { engMeaning: wordDto.engMeaning },
    });
    const existedNewWord = await this.wordRepository.findOne({
      where: { engMeaning: wordDto.newEngMeaning },
    });

    if (!existedWord) {
      console.warn(`Word "${wordDto.engMeaning}" does not exist.`);
      return {
        statusCode: 404,
        message: `Word "${wordDto.engMeaning}" does not exist.`,
      };
    }
    if (existedNewWord) {
      console.warn(`Word "${wordDto.newEngMeaning}" already exists.`);
      return {
        statusCode: 409,
        message: `Word "${wordDto.newEngMeaning}" already exists.`,
      };
    }

    wordDto.wordKind.sort();
    try {
      await this.wordRepository.update(existedWord.id, {
        engMeaning: wordDto.newEngMeaning,
        vnMeaning: wordDto.vnMeaning,
        wordKind: wordDto.wordKind,
        lastUpdate: new Date(),
      });

      console.log(
        `Updated word "${wordDto.engMeaning} --> ${wordDto.newEngMeaning}" successfully.`,
      );
      return {
        statusCode: 200,
        message: `Updated word "${wordDto.engMeaning} --> ${wordDto.newEngMeaning}" successfully.`,
      };
    } catch (error) {
      console.error('Error updating word:', error);
      throw new InternalServerErrorException('Database update failed');
    }
  }

  async getAllWords(): Promise<returnWordsDto> {
    try {
      const wordsDb = await this.wordRepository.find({ take: 100 });
      const words = wordsDb.map((word) => ({
        engMeaning: word.engMeaning,
        vnMeaning: word.vnMeaning,
        wordKind: word.wordKind,
      }));

      if (words.length === 0) {
        console.warn('No words found in the database.');
      }

      return {
        statusCode: 200,
        words: words,
      };
    } catch (error) {
      console.error('Error fetching all words:', error);
      throw new InternalServerErrorException('Database fetch failed');
    }
  }

  async getWordByEngMeaning(engMeaning: string): Promise<returnWordDto> {
    engMeaning =
      engMeaning.charAt(0).toUpperCase() + engMeaning.slice(1).toLowerCase();
    try {
      console.log(`Fetching word with English meaning: ${engMeaning}`);
      const wordDb = await this.wordRepository.findOne({
        where: { engMeaning: engMeaning },
      });

      if (!wordDb) {
        console.warn(`Word "${engMeaning}" not found.`);
        return {
          statusCode: 404,
        };
      }

      const word = {
        engMeaning: wordDb.engMeaning,
        vnMeaning: wordDb.vnMeaning,
        wordKind: wordDb.wordKind,
      };

      return {
        statusCode: 200,
        word: word,
      };
    } catch (error) {
      console.error('Error fetching word:', error);
      throw new InternalServerErrorException('Database fetch failed');
    }
  }

  async fuzzyFindWords(searchTerm: string): Promise<returnWordsDto> {
    try {
      const wordsDb = await this.wordRepository
        .createQueryBuilder('words')
        .limit(100)
        .where('similarity(words.engMeaning, :term) > 0.3')
        .orWhere('similarity(words.vnMeaning, :term) > 0.3')
        .orderBy(
          'GREATEST(similarity(words.engMeaning, :term), similarity(words.vnMeaning, :term))',
          'DESC',
        )
        .setParameter('term', searchTerm)
        .getMany();
      // .getRawMany(); // Use getRawMany if you want raw results

      const words = wordsDb.map((word) => ({
        engMeaning: word.engMeaning,
        vnMeaning: word.vnMeaning,
        wordKind: word.wordKind,
      }));

      console.log(`Found ${words.length} words matching "${searchTerm}"`);
      return {
        statusCode: 200,
        words: words,
      };
    } catch (error) {
      console.error('Error finding words:', error);
      throw new InternalServerErrorException('Database search failed');
    }
  }

  async deleteWordByEngMeaning(engMeaning: string): Promise<returnStringDto> {
    engMeaning =
      engMeaning.charAt(0).toUpperCase() + engMeaning.slice(1).toLowerCase();
    try {
      const result = await this.wordRepository.delete({ engMeaning });
      if (result.affected === 0) {
        console.warn(`Word "${engMeaning}" does not exist.`);
        return {
          statusCode: 404,
          message: `Word "${engMeaning}" does not exist.`,
        };
      }

      console.log(
        `Word with English meaning "${engMeaning}" deleted successfully.`,
      );
      return {
        statusCode: 200,
        message: `Word with English meaning "${engMeaning}" deleted successfully.`,
      };
    } catch (error) {
      console.error('Error deleting word:', error);
      throw new InternalServerErrorException('Database delete failed');
    }
  }
}
