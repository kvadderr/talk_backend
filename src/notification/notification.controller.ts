import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model'

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {    
    constructor(private readonly notificationService: NotificationService) {}

    @ApiOperation({ summary: 'Получить список всех уведомлений по ID' })
    @ApiResponse({ status: 200 })
    @Get('/:userId')
    getMyNotification(@Param('userId') userId: number) {
        return this.notificationService.getAllById(userId);
    }

    @ApiOperation({ summary: 'Сохранить уведомление' })
    @ApiResponse({ status: 200 })
    @Post()
    populate(@Body() data) {
        return this.notificationService.save(data);
    }

}