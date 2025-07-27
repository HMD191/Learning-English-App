import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@database/db.module';
import { WordModule } from './word-manager/word.module';

@Module({
  imports: [ConfigModule.forRoot(), DbModule, WordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
