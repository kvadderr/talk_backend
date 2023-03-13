import {
    Body,
    Controller,
    Get,
    HttpException,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    Headers,
    Param,
  } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Регистрация' })
    @ApiResponse({ status: 200 })
    @Post('/register')
    async register( @Body() data ) { 
        return await this.authService.register(data) 
    }

    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: 200 })
    @Post('/login')
    async login( @Body() data ) {
        return await this.authService.login( data.login, data.password )
    }

    @ApiOperation({ summary: 'Подтверждение кода подтверждения' })
  @ApiResponse({ status: 200 })
  @Post('/updateBaseData')
  async updateBaseData(
    @Body() data
  ) {
    return await this.authService.updateBaseData(
        data
    );
  }

  @ApiOperation({ summary: 'Сброс пароля' })
  @ApiResponse({ status: 200 })
  @Post('/restorePassword')
  async restore(
    @Body() data
  ) {
    return await this.authService.restorePassword(
        data
    );
  }

  @ApiOperation({ summary: 'Отправка кода подтверждения' })
  @ApiResponse({ status: 200 })
  @Post('/sendCode')
  async sendCode(
    @Body() data
  ) {
    return await this.authService.sendConfirmCodeEmail(
        data.userId
    );
  }

  @ApiOperation({ summary: 'Подтверждение кода подтверждения' })
  @ApiResponse({ status: 200 })
  @Post('/confirm')
  async comfirmMail(
    @Body() data
  ) {
    return await this.authService.confirmProfile(
        data
    );
  }

}