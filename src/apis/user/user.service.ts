import {
  Injectable,
  BadRequestException,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { UserEntity } from '../../entities/user/user.entity';
import { Repository } from 'typeorm';
import { Roles } from '../../shared/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  async findById(id: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  async login(dto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Unable to find email with given email');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async register(user: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await hash(user.password, 10);

    try {
      const result = await this.userRepo.save({
        ...user,
        password: hashedPassword,
      });

      return result;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async remove(id: string): Promise<void> {
    await this.userRepo.softDelete({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.password) {
      const hashedPassword = await hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    try {
      return this.userRepo.save(user);
    } catch (error) {
      throw new HttpException(
        'Error updating user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRole(id: string, role: Roles): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;

    try {
      return this.userRepo.save(user);
    } catch (error) {
      throw new HttpException(
        'Error updating user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
