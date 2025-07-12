import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { PayloadDto } from './dto/payload.dto';
import { TokenDto } from './dto/token.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private configService: ConfigService,
  ) {}

  async signUp(body:RegisterDto): Promise<TokenDto>{
    await this.authRepository.createUser(body)
    const user = await this.authRepository.findOneByEmail(body.email);
    const payload: PayloadDto = {email: user.email,uuid: user.uuid}
    const access_token = await this.jwtService.signAsync(payload, {expiresIn: '15m'})
    const refresh_token = await this.jwtService.signAsync(payload, {expiresIn: '1d'})

    return {
      uuid: user.uuid,
      access_token:access_token,
      refresh_token: refresh_token,
    }
  }

  async logIn(body: LoginDto): Promise<TokenDto>{
    const user = await this.authRepository.findOneByEmail(body.email);
    if(!(await bcrypt.compare(body.password, user.password))){
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload : PayloadDto = {email: user.email, uuid: user.uuid};
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {expiresIn: '1d'});

    await this.authRepository.saveToken(payload.uuid, refresh_token); 

    return{
      uuid: payload.uuid,
      access_token: access_token,
      refresh_token: refresh_token,
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenDto>{
    const payload: PayloadDto & {iat; exp} = this.jwtService.verify(refreshToken, 
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      }
    );

    const user = await this.authRepository.findUser(payload.uuid);
    if(refreshToken !== user.refresh_token){
      throw new UnauthorizedException('Unauthorized action')
    }

    delete payload.iat
    delete payload.exp

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload);

    this.authRepository.saveToken(payload.uuid, refresh_token)

    return{
      uuid: payload.uuid,
      access_token: access_token,
      refresh_token: refresh_token,
    }
  }

  async logOut(access_token: string){
    const payload: PayloadDto & {iat; exp} = this.jwtService.verify(access_token,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      }
    );

    return this.authRepository.deleteToken(payload.uuid);
  }
}