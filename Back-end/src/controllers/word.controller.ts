import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WordDto, UpdateWordDto } from '@dtos/word-manager.dto';
import { WordService } from '@modules/word-manager/word.service';
import {
  returnStringDto,
  returnWordDto,
  returnWordsDto,
} from '@dtos/return-message.dto';

@Controller()
export class WordController {
  constructor(private readonly wordService: WordService) {}

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
