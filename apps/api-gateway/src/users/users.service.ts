import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@bisontrade/db';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    readonly usersRepository: Repository<User>
  ) {}

  async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findUser(username: string, opts: { withPassword?: boolean } = {}) {
    const { withPassword } = opts;
    if (withPassword) {
      return this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.username = :username', { username })
        .getOne();
    }

    return this.usersRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findUser(username, { withPassword: true });
    if (user?.checkPassword(password)) {
      return user;
    }
    return null;
  }
}
