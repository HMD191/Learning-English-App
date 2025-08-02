import { Injectable } from '@nestjs/common';
import { UserDto } from '@src/dtos/user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      username: 'john',
      password: 'changeme',
    },
    {
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<UserDto | undefined> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await this.users.find((user) => user.username === username);
  }
}
