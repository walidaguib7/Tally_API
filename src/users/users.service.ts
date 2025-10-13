import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashing } from 'src/utils/hashing';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash: await hashing(createUserDto.password),
      roles: createUserDto.role,
    });
    await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException('User not found!');
    user.firstname = updateUserDto.firstname!;
    user.lastname = updateUserDto.lastname!;
    user.username = updateUserDto.username!;
    user.phone_number = updateUserDto.phone_number!;
    await this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException('User not found!');
    await this.usersRepository.remove(user);
  }
}
