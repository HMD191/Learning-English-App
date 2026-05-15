import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION') as StringValue,
        },
      }),
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
