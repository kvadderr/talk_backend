import { Body, Controller, Get, Post, Param, UseInterceptors, Res, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { User } from './user.model'

@ApiTags('User')
@Controller('user')
export class UserController {    
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Получить информацию об опеределенном пользователе по его ID' })
    @ApiResponse({ status: 200, type: User })
    @Get('/:id')
    getMe(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @ApiOperation({ summary: 'Обновление основного баланса пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/populate')
    populate(@Body() data) {
        return this.userService.populateBalance(data.id, data.balance);
    }

    @ApiOperation({ summary: 'Обновление бонусов пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/populateBonus')
    populateBonus(@Body() data) {
        return this.userService.populateBonus(data.id, data.bonus);
    }

    @ApiOperation({ summary: 'Симуляция оплаты' })
    @ApiResponse({ status: 200 })
    @Post('/payment')
    payment(@Body() data) {
        return this.userService.payment(data.id, data.amount);
    }

    @ApiOperation({ summary: 'Контроль блокировки пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/ban')
    userBan(@Body() data) {
        return this.userService.banUser(data.id, data.isBanned, data.banCause);
    }

    @ApiOperation({ summary: 'Обновление аватара пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/updateAvatar')
    async updateAvatar(
        @Body() data
    ) {
        return await this.userService.updateAvatar(data);
    }

    @ApiOperation({ summary: 'uploadPhoto' })
    @ApiResponse({ status: 200 })
    @Post('/uploadPhoto')
    @UseInterceptors(FileInterceptor('image', {
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