  import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
  import { AuthRepository } from './auth.repository';
  import { TokenDto } from './dto/token.dto';
  import { ConfigService } from '@nestjs/config';
  import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

  @Injectable()
  export class AuthService {
      private readonly logger = new Logger(AuthService.name)
      constructor(
      private authRepository: AuthRepository,
      private configService: ConfigService,
      private httpService: HttpService,
    ) {}

  async loginOrSignup(code: string, codeVerifier: string): Promise<TokenDto> {
    try {
      const clientId = this.configService.get<string>('CLIENT_ID');
      const clientSecret = this.configService.get<string>('CLIENT_SECRET');

          if (!code || !codeVerifier) {
            throw new BadRequestException('Missing required parameters');
          }

          const tokenResponse = await firstValueFrom(
            this.httpService.post(
              'https://api.idp.gistory.me/oauth/token',
              new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                code_verifier: codeVerifier, 
              }),
              {
                headers: {
                  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000, 
              },
            ),
          );

      const userInfoResponse = await firstValueFrom(
        this.httpService.get('https://api.idp.gistory.me/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
          timeout: 10000,
        }),
      );

      if (!userInfoResponse.data || !userInfoResponse.data.sub) {
        throw new UnauthorizedException('Invalid user information');
      }

      const user = await this.authRepository.findOrCreateUser(userInfoResponse.data);

      return {
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
    };

    } catch (error) {
      this.logger.error('Login failed', { error: error.message, code });
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new UnauthorizedException('Authentication failed');
    }
  }
}