import { UpdateWordDto, WordDto } from '@dtos/word-manager.dto';
import { WordService } from './word.service';
import { Any, Repository } from 'typeorm';
import { Words } from '@database/entities/word.entity';
import { WordKind } from '@constants/constants';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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

    it('should update an existing word', async () => {
      const wordDto: WordDto = {
        engMeaning: 'test',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
      };

      mockWordRepository.findOne.mockResolvedValue(wordFromDb);
      mockWordRepository.update.mockResolvedValue({ affected: 1 });

      const result = await wordService.addWord(wordDto);
      expect(result).toStrictEqual({
        statusCode: 200,
        message: `Word "${wordDto.engMeaning}" already exists. Updated word kind successfully.`,
      });
      expect(mockWordRepository.update).toHaveBeenCalledWith(
        wordFromDb.id,
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          wordKind: expect.arrayContaining([
            WordKind.Adj,
            WordKind.Noun,
            WordKind.Verb,
          ]),
          lastUpdate: expect.any(Date),
        }),
      );
    });
  });

  describe('updateWord', () => {
    it('should not update word does not exist', async () => {
      const updateWordDto: UpdateWordDto = {
        engMeaning: 'test not exist',
        newEngMeaning: 'test updated',
        vnMeaning: 'kiểm tra update',
        wordKind: [WordKind.Adj],
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
      };

      mockWordRepository.findOne.mockResolvedValueOnce(existingWord);
      mockWordRepository.findOne.mockResolvedValueOnce(null); // Simulate no existing new word
      mockWordRepository.update.mockResolvedValue({ affected: 1 });

      const result = await wordService.updateWord(updateWordDto);
      expect(result).toStrictEqual({
        statusCode: 200,
        message: `Updated word "${updateWordDto.engMeaning} --> ${updateWordDto.newEngMeaning}" successfully.`,
      });
      expect(mockWordRepository.update).toHaveBeenCalledWith(
        existingWord.id,
        expect.objectContaining({
          engMeaning: updateWordDto.newEngMeaning,
          vnMeaning: updateWordDto.vnMeaning,
          wordKind: expect.arrayContaining([WordKind.Adj]),
          lastUpdate: expect.any(Date),
        }),
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
        },
        {
          id: 2,
          engMeaning: 'example',
          vnMeaning: 'ví dụ',
          wordKind: [WordKind.Verb],
          lastUpdate: new Date(),
        },
      ];
      mockWordRepository.find.mockResolvedValue(words);

      const result = await wordService.getAllWords();
      expect(result).toStrictEqual({
        words: words.map((word) => ({
          engMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
          wordKind: word.wordKind,
        })),
        statusCode: 200,
      });
      expect(mockWordRepository.find).toHaveBeenCalledWith({ take: 100 });
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
      };
      mockWordRepository.findOne.mockResolvedValue(word);

      const result = await wordService.getWordByEngMeaning(engMeaning);
      expect(result).toStrictEqual({
        word: {
          engMeaning: word.engMeaning,
          vnMeaning: word.vnMeaning,
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
        },
      ];

      const mockQueryBuilder: any = {
        limit: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
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
