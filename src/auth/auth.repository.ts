import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private prisma: PrismaService) {}

  private handlePrismaError(error: any, uuid: string): never {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User is not found');
      }

      if (error.code === 'P2002') {
        throw new ConflictException('User with your email already exists');
      }
    }

    this.logger.error(`Unexpected error for user ${uuid}`, error);
    throw new InternalServerErrorException('Internal Server Error');
  }

  async findUser(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: uuid },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  async createUser(body: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

      return await this.prisma.user.create({
        data: {
          name: body.name,
          username: body.username,
          email: body.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.logger.debug(error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`User with email ${body.email} already exists`);
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOneByEmail(email: string) {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);}
      return user;
    }

  async saveToken(uuid: string, token: string) {
    try {
      await this.prisma.user.update({
        where: { uuid },
        data: { refresh_token: token },
      });

      this.logger.log(`Refresh token saved for user ${uuid}`);
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }

  async deleteToken(uuid: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { uuid },
        data: { refresh_token: null },
      });

      this.logger.log(`Refresh token deleted for user ${uuid}`);
    } catch (error) {
      this.handlePrismaError(error, uuid);
    }
  }
}
