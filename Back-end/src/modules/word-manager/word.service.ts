import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Words } from '@database/entities/word.entity';
import { WordDto, UpdateWordDto, FilterWordsDto } from '@dtos/word-manager.dto';
import { Repository } from 'typeorm';
import {
  ReturnStringDto,
  ReturnWordDto,
  ReturnWordsDto,
} from '@dtos/return-message.dto';
import { Categories } from '@database/entities/category.entity';
import { capitalizeFirstLetter } from '@src/common/helper';
import e from 'express';

Injectable();
export class WordService {
  constructor(
    @InjectRepository(Words)
    private wordRepository: Repository<Words>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async addWord(wordDto: WordDto): Promise<ReturnStringDto> {
    wordDto.wordKind.sort();
    wordDto.engMeaning = capitalizeFirstLetter(wordDto.engMeaning);

    if (wordDto.category) {
      wordDto.category = capitalizeFirstLetter(wordDto.category);
    }

    // check if the word already exists
    const existedWord = await this.wordRepository.findOne({
      where: { engMeaning: wordDto.engMeaning },
    });

    if (existedWord) {
      console.log(`Word "${wordDto.engMeaning}" already exists.`);
      return {
        statusCode: 409,
        message: `Word "${wordDto.engMeaning}" already exists.`,
      };
    }

    try {
      const wordToInsert: Partial<Words> = {
        engMeaning: wordDto.engMeaning,
        vnMeaning: wordDto.vnMeaning,
        wordKind: wordDto.wordKind,
      };

      if (wordDto.category) {
        const categoryDb = await this.categoryRepository.findOne({
          where: { categoryName: wordDto.category },
        });
        if (categoryDb) {
          wordToInsert.category = categoryDb;
        } else {
          console.warn(`Category "${wordDto.category}" does not exist.`);
          console.warn('Category will be set to null.');
        }
      }

      const newWord = this.wordRepository.create(wordToInsert);
      console.log('newWord:', newWord);
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

  async updateWord(wordDto: UpdateWordDto): Promise<ReturnStringDto> {
    console.log('Updating word:', wordDto);
    wordDto.engMeaning = capitalizeFirstLetter(wordDto.engMeaning);
    wordDto.vnMeaning = capitalizeFirstLetter(wordDto.vnMeaning);
    wordDto.newEngMeaning = capitalizeFirstLetter(wordDto.newEngMeaning);
    wordDto.wordKind.sort();

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
    if (existedNewWord && existedNewWord.engMeaning !== wordDto.engMeaning) {
      console.warn(`Word "${wordDto.newEngMeaning}" already exists.`);
      return {
        statusCode: 409,
        message: `Word "${wordDto.newEngMeaning}" already exists.`,
      };
    }

    try {
      const wordToUpdate: Partial<Words> = {
        engMeaning: wordDto.newEngMeaning,
        vnMeaning: wordDto.vnMeaning,
        wordKind: wordDto.wordKind,
        lastUpdate: new Date(),
      };

      if (wordDto.category) {
        wordDto.category = capitalizeFirstLetter(wordDto.category);
        const categoryDb = await this.categoryRepository.findOne({
          where: { categoryName: wordDto.category },
        });

        if (categoryDb) {
          wordToUpdate.category = categoryDb;
        } else {
          console.warn(`Category "${wordDto.category}" does not exist.`);
          console.warn('Category will be set to null.');
          wordToUpdate.category = null;
        }
      } else {
        wordToUpdate.category = null;
      }

      await this.wordRepository.update(
        { engMeaning: wordDto.engMeaning },
        wordToUpdate,
      );

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

  async getAllWords(): Promise<ReturnWordsDto> {
    console.log('Fetching all words from the database...');
    try {
      const wordsDb = await this.wordRepository.find({
        take: 100,
        relations: ['category'],
      });
      const words = wordsDb.map((word) => ({
        engMeaning: word.engMeaning,
        vnMeaning: word.vnMeaning,
        wordKind: word.wordKind,
        category: word.category ? word.category.categoryName : null,
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

  async getWordByEngMeaning(engMeaning: string): Promise<ReturnWordDto> {
    engMeaning = capitalizeFirstLetter(engMeaning);

    try {
      console.log(`Fetching word with English meaning: ${engMeaning}`);
      const wordDb = await this.wordRepository.findOne({
        where: { engMeaning: engMeaning },
        relations: ['category'],
      });

      if (!wordDb) {
        console.warn(`Word "${engMeaning}" not found.`);
        return {
          statusCode: 404,
        };
      }

      console.log(wordDb);

      const word = {
        engMeaning: wordDb.engMeaning,
        vnMeaning: wordDb.vnMeaning,
        wordKind: wordDb.wordKind,
        category: wordDb.category ? wordDb.category.categoryName : null,
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

  async fuzzyFindWords(searchTerm: string): Promise<ReturnWordsDto> {
    try {
      const wordsDb = await this.wordRepository
        .createQueryBuilder('words')
        .leftJoinAndSelect('words.category', 'category')
        .limit(100)
        .where('similarity(words.engMeaning, :term) > 0.3')
        .orWhere('similarity(words.vnMeaning, :term) > 0.3')
        .orderBy(
          'GREATEST(similarity(words.engMeaning, :term), similarity(words.vnMeaning, :term))',
          'DESC',
        )
        .setParameter('term', searchTerm)
        .getMany();

      const words = wordsDb.map((word) => ({
        engMeaning: word.engMeaning,
        vnMeaning: word.vnMeaning,
        wordKind: word.wordKind,
        category: word.category ? word.category.categoryName : null,
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

  async filterWords(filter: FilterWordsDto): Promise<ReturnWordsDto> {
    const { categories, wordKind } = filter;

    const queryBuilder = this.wordRepository
      .createQueryBuilder('words')
      .leftJoinAndSelect('words.category', 'category');

    if (categories && categories.length > 0) {
      queryBuilder.leftJoinAndSelect('words.category', 'category');
      queryBuilder.where('category.categoryName IN (:...categories)', {
        categories: categories.map(
          (c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase(),
        ),
      });
    }

    if (wordKind && wordKind.length > 0) {
      queryBuilder.andWhere(
        'words.wordKind && ARRAY[:...wordKind]::varchar[]',
        {
          wordKind: wordKind.map((w) => w.toLowerCase()),
        },
      );
    }

    try {
      const wordsDb = await queryBuilder.getMany();
      const words = wordsDb.map((word) => ({
        engMeaning: word.engMeaning,
        vnMeaning: word.vnMeaning,
        wordKind: word.wordKind,
        category: word.category ? word.category.categoryName : null,
      }));

      console.log(`Found ${words.length} words matching the filter.`);
      return {
        statusCode: 200,
        words: words,
      };
    } catch (error) {
      console.error('Error filtering words:', error);
      throw new InternalServerErrorException('Database filter failed');
    }
  }

  async deleteWordByEngMeaning(engMeaning: string): Promise<ReturnStringDto> {
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
