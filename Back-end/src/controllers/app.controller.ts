import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { WordDto, UpdateWordDto } from '@dtos/word-manager.dto';
import { WordService } from '@modules/word-manager/word.service';
import {
  returnStringDto,
  returnWordDto,
  returnWordsDto,
} from '@src/dtos/return-message.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly wordService: WordService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('add-word')
  async addWord(@Body() wordDto: WordDto): Promise<returnStringDto> {
    return await this.wordService.addWord(wordDto);
  }

  @Put('update-word')
  async updateWord(@Body() wordDto: UpdateWordDto): Promise<returnStringDto> {
    return await this.wordService.updateWord(wordDto);
  }

  @Get('all-words')
  async getAllWords(): Promise<returnWordsDto> {
    return await this.wordService.getAllWords();
  }

  @Get('get-word/:engMeaning')
  async getWordByEngMeaning(
    @Param('engMeaning') engMeaning: string,
  ): Promise<returnWordDto> {
    return await this.wordService.getWordByEngMeaning(engMeaning);
  }

  @Get('fuzzy-find-words/:searchTerm')
  async fuzzyFindWords(
    @Param('searchTerm') searchTerm: string,
  ): Promise<returnWordsDto> {
    return await this.wordService.fuzzyFindWords(searchTerm);
  }

  @Delete('delete-word/:engMeaning')
  async deleteWord(
    @Param('engMeaning') engMeaning: string,
  ): Promise<returnStringDto> {
    return this.wordService.deleteWordByEngMeaning(engMeaning);
  }
}
