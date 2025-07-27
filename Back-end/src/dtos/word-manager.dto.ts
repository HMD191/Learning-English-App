import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { WordKind } from '@database/entities/word.entity';

class WordDto {
  @IsString({ message: 'English word must be a string' })
  @IsNotEmpty({ message: 'English word cannot be empty' })
  @MaxLength(255)
  engMeaning: string;

  @IsString({ message: 'Vietnamese word must be a string' })
  @IsNotEmpty({ message: 'Vietnamese word cannot be empty' })
  @MaxLength(255)
  vnMeaning: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(Object.values(WordKind), {
    each: true,
    message: 'Word kind must be one of the following: noun, verb, adj, adv',
  })
  wordKind: WordKind[];
}

class UpdateWordDto extends WordDto {
  @IsString({ message: 'New English word must be a string' })
  @IsNotEmpty({ message: 'New English word cannot be empty' })
  @MaxLength(255)
  newEngMeaning: string;
}

export { WordDto, UpdateWordDto };
