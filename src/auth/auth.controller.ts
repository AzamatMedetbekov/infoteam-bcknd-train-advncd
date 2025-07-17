import {  Controller, Post, Query, UseFilters, } from '@nestjs/common';
import {  ApiBody, ApiInternalServerErrorResponse, ApiOperation,  } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto'; 
  
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService){}

  @Post('login')
  @ApiOperation({ summary: 'Login or signup' })
  @ApiBody({
    type: LoginDto,
    description: "Details to perform this action"
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async login(@Query() { code, code_verifier }: LoginDto): Promise<TokenDto> {
    return await this.authService.loginOrSignup(code, code_verifier);
  }
}
