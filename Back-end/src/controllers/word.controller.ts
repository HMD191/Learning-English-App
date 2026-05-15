import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { WordDto, UpdateWordDto, FilterWordsDto } from '@dtos/word-manager.dto';
import { WordService } from '@modules/word-manager/word.service';
import {
  ReturnCategoryDto,
  ReturnStringDto,
  ReturnWordDto,
  ReturnWordsDto,
} from '@dtos/return-message.dto';
import { CategoryService } from '@src/modules/word-manager/category.service';
import { WordKind } from '@src/constants/constants';

@Controller()
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('words')
  async addWord(@Body() wordDto: WordDto): Promise<ReturnStringDto> {
    return await this.wordService.addWord(wordDto);
  }

  @Put('words')
  async updateWord(@Body() wordDto: UpdateWordDto): Promise<ReturnStringDto> {
    return await this.wordService.updateWord(wordDto);
  }

  @Get('words')
  async getAllWords(): Promise<ReturnWordsDto> {
    return await this.wordService.getAllWords();
  }

  @Post('words/filter')
  async filterWords(@Body() filter: FilterWordsDto): Promise<ReturnWordsDto> {
    return await this.wordService.filterWords(filter);
  }

  @Get('words/search')
  async fuzzyFindWords(
    @Query('q') searchTerm: string,
  ): Promise<ReturnWordsDto> {
    return await this.wordService.fuzzyFindWords(searchTerm);
  }

  @Get('words/:engMeaning')
  async getWordByEngMeaning(
    @Param('engMeaning') engMeaning: string,
  ): Promise<ReturnWordDto> {
    return await this.wordService.getWordByEngMeaning(engMeaning);
  }

  @Delete('words/:engMeaning')
  async deleteWord(
    @Param('engMeaning') engMeaning: string,
  ): Promise<ReturnStringDto> {
    return this.wordService.deleteWordByEngMeaning(engMeaning);
  }

  // Category-related endpoints
  @Post('categories')
  async addCategory(
    @Body('categoryName') categoryName: string,
  ): Promise<ReturnStringDto> {
    return await this.categoryService.addCategory(categoryName);
  }

  @Put('categories')
  async updateCategory(
    @Body('oldCategoryName') oldCategoryName: string,
    @Body('newCategoryName') newCategoryName: string,
  ): Promise<ReturnStringDto> {
    return await this.categoryService.updateCategory(
      oldCategoryName,
      newCategoryName,
    );
  }

  @Get('categories')
  async getAllCategories(): Promise<ReturnCategoryDto> {
    return await this.categoryService.getAllCategories();
  }

  @Delete('categories')
  async deleteCategory(
    @Body('categoryName') categoryName: string,
  ): Promise<ReturnStringDto> {
    return await this.categoryService.deleteCategory(categoryName);
  }
}
