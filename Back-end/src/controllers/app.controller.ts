import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AddWordDto } from 'src/dtos/word.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('add-word')
  addWord(@Body() wordDto: AddWordDto): string {
    // Logic to add a word would go here
    console.log('Adding word:', wordDto);
    return `Word added successfully!`;
  }
}
