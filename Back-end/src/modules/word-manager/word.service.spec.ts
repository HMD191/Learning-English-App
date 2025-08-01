import { UpdateWordDto, WordDto } from '@dtos/word-manager.dto';
import { WordService } from './word.service';
import { Any, Repository } from 'typeorm';
import { Words } from '@database/entities/word.entity';
import { WordKind } from '@constants/constants';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get } from 'http';
import { Categories } from '@src/database/entities/category.entity';

const mockWordRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  setParameter: jest.fn().mockReturnThis(),
  getRawMany: jest.fn(),
  getMany: jest.fn(),
};

const mockCategoryRepository = {
  findOne: jest.fn(),
};

describe('WordService', () => {
  let wordService: WordService;
  let repo: jest.Mocked<Repository<Words>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Words),
          useValue: mockWordRepository,
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoryRepository,
        },
        WordService,
      ],
    }).compile();

    wordService = module.get<WordService>(WordService);
    repo = module.get(getRepositoryToken(Words));
    wordService['wordRepository'] = repo; // Inject mock repository
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(wordService).toBeDefined();
  });

  describe('addWord', () => {
    const wordDto: WordDto = {
      engMeaning: 'test',
      vnMeaning: 'kiểm tra',
      wordKind: [WordKind.Noun, WordKind.Verb],
      category: null,
    };
    const wordFromDb = {
      ...wordDto,
      id: 1,
      lastUpdate: new Date(),
      metadata: null,
    };

    it('should add a new word if it does not exist', async () => {
      mockWordRepository.findOne.mockResolvedValue(null);
      mockWordRepository.create.mockReturnValue(wordFromDb);
      mockWordRepository.save.mockResolvedValue(Any);

      const result = await wordService.addWord(wordDto);
      expect(result).toStrictEqual({
        statusCode: 201,
        message: 'Word added successfully!',
      });
    });

    it('should do nothing if word existed', async () => {
      const wordDto: WordDto = {
        engMeaning: 'test',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
        category: null,
      };

      mockWordRepository.findOne.mockResolvedValue(wordFromDb);

      const result = await wordService.addWord(wordDto);
      expect(result).toStrictEqual({
        statusCode: 409,
        message: `Word "${wordDto.engMeaning}" already exists.`,
      });
    });
  });

  describe('updateWord', () => {
    it('should not update word does not exist', async () => {
      const updateWordDto: UpdateWordDto = {
        engMeaning: 'test not exist',
        newEngMeaning: 'test updated',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
        category: null,
      };
      mockWordRepository.findOne.mockResolvedValue(null);

      const result = await wordService.updateWord(updateWordDto);
      expect(result).toStrictEqual({
        statusCode: 404,
        message: `Word "${updateWordDto.engMeaning}" does not exist.`,
      });
    });
    it('should not update word if new word already exists', async () => {
      const existingWord = {
        id: 1,
        engMeaning: 'test',
        vnMeaning: 'kiểm tra',
        wordKind: [WordKind.Noun, WordKind.Verb],
        lastUpdate: new Date(),
      };
      const existingNewWord = {
        id: 2,
        engMeaning: 'test updated',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
        lastUpdate: new Date(),
      };
      const updateWordDto: UpdateWordDto = {
        engMeaning: 'test',
        newEngMeaning: 'test updated',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
        category: null,
      };

      mockWordRepository.findOne.mockResolvedValueOnce(existingWord);
      mockWordRepository.findOne.mockResolvedValueOnce(existingNewWord); // Simulate existing new word

      const result = await wordService.updateWord(updateWordDto);
      expect(result).toStrictEqual({
        statusCode: 409,
        message: `Word "${updateWordDto.newEngMeaning}" already exists.`,
      });
    });
    it('should update an existing word', async () => {
      const existingWord = {
        id: 1,
        engMeaning: 'test',
        vnMeaning: 'kiểm tra',
        wordKind: [WordKind.Noun, WordKind.Verb],
        lastUpdate: new Date(),
      };
      const updateWordDto: UpdateWordDto = {
        engMeaning: 'test',
        newEngMeaning: 'test updated',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
        category: null,
      };

      mockWordRepository.findOne.mockResolvedValueOnce(existingWord);
      mockWordRepository.findOne.mockResolvedValueOnce(null); // Simulate no existing new word
      mockWordRepository.update.mockResolvedValue({ affected: 1 });
      mockCategoryRepository.findOne.mockResolvedValue(null); // Simulate no category

      const result = await wordService.updateWord(updateWordDto);
      expect(result).toStrictEqual({
        statusCode: 200,
        message: `Updated word "${updateWordDto.engMeaning} --> ${updateWordDto.newEngMeaning}" successfully.`,
      });
      expect(mockWordRepository.update).toHaveBeenCalledWith(
        { engMeaning: updateWordDto.engMeaning },
        {
          engMeaning: updateWordDto.newEngMeaning,
          vnMeaning: updateWordDto.vnMeaning,
          wordKind: updateWordDto.wordKind,
          lastUpdate: expect.any(Date),
          category: null, // Ensure category is set to null if not provided
        },
      );
    });
  });

  describe('getAllWords', () => {
    it('should return all words', async () => {
      const words = [
        {
          id: 1,
          engMeaning: 'test',
          vnMeaning: 'kiểm tra',
          wordKind: [WordKind.Noun],
          lastUpdate: new Date(),
          category: null,
        },
        {
          id: 2,
          engMeaning: 'example',
          vnMeaning: 'ví dụ',
          wordKind: [WordKind.Verb],
          lastUpdate: new Date(),
          category: null,
        },
      ];
      mockWordRepository.find.mockResolvedValue(words);

      const result = await wordService.getAllWords();
      expect(result).toStrictEqual({
        words: words.map((word) => ({
          engMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
          wordKind: word.wordKind,
          category: null,
        })),
        statusCode: 200,
      });
      expect(mockWordRepository.find).toHaveBeenCalledWith({
        take: 100,
        relations: ['category'],
      });
    });
  });

  describe('getWordByEngMeaning', () => {
    it('should return word by English meaning', async () => {
      const engMeaning = 'test';
      const word = {
        id: 1,
        engMeaning: 'test',
        vnMeaning: 'kiểm tra',
        wordKind: [WordKind.Noun],
        lastUpdate: new Date(),
        category: null,
      };
      mockWordRepository.findOne.mockResolvedValue(word);

      const result = await wordService.getWordByEngMeaning(engMeaning);
      expect(result).toStrictEqual({
        word: {
          engMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
          category: null,
          wordKind: word.wordKind,
        },
        statusCode: 200,
      });
    });

    it('should return 404 if word does not exist', async () => {
      const engMeaning = 'test';
      mockWordRepository.findOne.mockResolvedValue(null);

      const result = await wordService.getWordByEngMeaning(engMeaning);
      expect(result).toStrictEqual({
        statusCode: 404,
      });
    });
  });

  describe('fuzzyFindWords', () => {
    it('should return words matching search term', async () => {
      const searchTerm = 'test';
      const words = [
        {
          id: 1,
          engMeaning: 'test',
          vnMeaning: 'kiểm tra',
          wordKind: [WordKind.Noun],
          lastUpdate: new Date(),
          category: null,
        },
      ];

      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(words),
      };
      mockWordRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await wordService.fuzzyFindWords(searchTerm);
      expect(result).toStrictEqual({
        words: words.map((word) => ({
          engMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
          wordKind: word.wordKind,
          category: null,
        })),
        statusCode: 200,
      });
    });

    it('should return empty array if no words match', async () => {
      const searchTerm = 'nonexistent';

      const mockQueryBuilder: any = {
        limit: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockWordRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await wordService.fuzzyFindWords(searchTerm);
      expect(result).toStrictEqual({
        words: [],
        statusCode: 200,
      });
    });
  });

  describe('deleteWordByEngMeaning', () => {
    it('should delete word by English meaning', async () => {
      const engMeaning = 'Test';
      mockWordRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await wordService.deleteWordByEngMeaning(engMeaning);
      expect(result).toStrictEqual({
        statusCode: 200,
        message: `Word with English meaning "${engMeaning}" deleted successfully.`,
      });
    });

    it('should return 404 if word does not exist', async () => {
      const engMeaning = 'Nonexistent';
      mockWordRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await wordService.deleteWordByEngMeaning(engMeaning);
      expect(result).toStrictEqual({
        statusCode: 404,
        message: `Word "${engMeaning}" does not exist.`,
      });
    });
  });
});
