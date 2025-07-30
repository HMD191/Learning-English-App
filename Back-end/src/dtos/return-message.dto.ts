import { QuestionAnswerDto } from './question-answer.dto';
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

class returnQuestionAnswerDto {
  statusCode: number;
  questionAnswer?: QuestionAnswerDto;
}

export {
  returnStringDto,
  returnWordsDto,
  returnWordDto,
  returnQuestionAnswerDto,
};
