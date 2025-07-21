import { IsIn, IsNotEmpty, IsString } from 'class-validator';

class AddWordDto {
  @IsString({ message: 'English word must be a string' })
  @IsNotEmpty({ message: 'English word cannot be empty' })
  engMeaning: string;

  @IsString({ message: 'Vietnamese word must be a string' })
  @IsNotEmpty({ message: 'Vietnamese word cannot be empty' })
  vnMeaning: string;

  @IsIn(['noun', 'verb', 'adj', 'adv'], {
    message: 'Word kind must be one of the following: noun, verb, adj, adv',
  })
  wordKind: string;
}

export { AddWordDto };
