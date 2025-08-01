import { QuestionAnswerDto } from './question-answer.dto';
import { WordDto } from './word-manager.dto';

class ReturnStringDto {
  statusCode: number;
  message?: string;
}

class ReturnWordsDto {
  statusCode: number;
  words?: WordDto[];
}

class ReturnWordDto {
  statusCode: number;
  word?: WordDto;
}

class ReturnQuestionAnswerDto {
  statusCode: number;
  questionAnswer?: QuestionAnswerDto;
}

class ReturnCategoryDto {
  statusCode: number;
  categories?: string[];
}

export {
  ReturnStringDto,
  ReturnWordsDto,
  ReturnWordDto,
  ReturnQuestionAnswerDto,
  ReturnCategoryDto,
};
