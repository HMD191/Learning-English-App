import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { WordKind } from '@constants/constants';

class WordDto {
  @IsString({ message: 'English word must be a string' })
  @IsNotEmpty({ message: 'English word cannot be empty' })
  @MaxLength(255)
  engMeaning!: string;

  @IsString({ message: 'Vietnamese word must be a string' })
  @IsNotEmpty({ message: 'Vietnamese word cannot be empty' })
  @MaxLength(255)
  vnMeaning!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(Object.values(WordKind), {
    each: true,
    message: 'Word kind must be one of the following: noun, verb, adj, adv',
  })
  wordKind!: WordKind[];

  synonyms: string | null | undefined;

  category: string | null | undefined;

  difficulty?: number | null | undefined;
}

class UpdateWordDto extends WordDto {
  @IsString({ message: 'New English word must be a string' })
  @IsNotEmpty({ message: 'New English word cannot be empty' })
  @MaxLength(255)
  newEngMeaning!: string;
}

class FilterWordsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Categories must be an array of strings' })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsIn(Object.values(WordKind), {
    each: true,
    message: 'Word kind must be one of the following: noun, verb, adj, adv',
  })
  wordKinds?: WordKind[];
}

export { WordDto, UpdateWordDto, FilterWordsDto };
