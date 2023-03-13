import { Body, Controller, Get, Post, Put, UseInterceptors, Res, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../user/user.model';
import { Operator } from './operator.model';
import { OperatorService } from './operator.service';

@ApiTags('Operator')
@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @ApiOperation({ summary: 'Список всех операторов' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Get()
  async getAllOperator() {
    return await this.operatorService.getAll();
  }

  @ApiOperation({ summary: 'Список топовых операторов' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Get('/top')
  async getTopOperator() {
    return await this.operatorService.getTopOperator();
  }

  @ApiOperation({ summary: 'Сохранить данные оператора' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Post()
  async save(@Body() data) {
    return await this.operatorService.save(data.operator);
  }

  @ApiOperation({ summary: 'Update operator data' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Put()
  async updateOperator(@Body() data) {
    return await this.operatorService.updateData(data);
  }

  @ApiOperation({ summary: 'Сохранить данные оператора' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Post('/updateStatus')
  async updateStatus(@Body() data) {
    return await this.operatorService.updateStatus(data.userId, data.status);
  }

  @ApiOperation({ summary: 'Обновление голоса оператора' })
  @ApiResponse({ status: 200 })
  @Post('/updateAudio')
  async updateAudio(@Body() data) {
    return await this.operatorService.loadAudio(data);
  }

  @ApiOperation({ summary: 'uploadAudio' })
    @ApiResponse({ status: 200 })
    @Post('/uploadAudio')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
            console.log('filenamess');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
            },
        }),
    }))
    upload(@UploadedFile() file) {
        const fileName = file.filename;
        console.log(fileName);
        return {fileName};
    }

}