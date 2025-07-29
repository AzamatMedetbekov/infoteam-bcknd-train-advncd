import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

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

  async findOrCreateUser(userInfo) {
    console.log(userInfo.sub);
    return await this.prisma.user
      .findFirst({ where: { sub: userInfo.sub } })
      .then(async (user) => {
        if (!user)
          return await this.prisma.user
            .create({
              data: {
                sub: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                studentId: userInfo.student_id,
                phoneNumber: userInfo.phone_number,
              },
            })
            .catch((error) => {
              this.logger.debug(error);
              this.handlePrismaError;
            });
        else return user;
      });
  }
}
