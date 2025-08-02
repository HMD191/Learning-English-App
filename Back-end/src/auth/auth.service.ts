import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from '@src/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: SignInDto): Promise<any> {
    const userDb = await this.usersService.findOne(user.username);
    if (userDb?.password !== user.password) {
      throw new UnauthorizedException();
    }
    console.log(process.env.JWT_SECRET);

    const payload = { username: userDb.username, password: userDb.password };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
