import { WordDto } from './word-manager.dto';

class returnStringDto {
  statusCode: number;
  message?: string;
}

class returnWordsDto {
  statusCode: number;
  words?: WordDto[];
}

class returnWordDto {
  statusCode: number;
  word?: WordDto;
}
export { returnStringDto, returnWordsDto, returnWordDto };
