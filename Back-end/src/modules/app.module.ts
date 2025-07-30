import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@database/db.module';
import { WordModule } from './word-manager/word.module';
import { LearningModeModule } from './learning-mode/learning-mode.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432).required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }),
    DbModule,
    WordModule,
    LearningModeModule,
  ],
  providers: [],
})
export class AppModule {}
