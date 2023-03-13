import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BonusService } from './bonus.service';
import { Bonus } from './bonus.model'

@ApiTags('Bonus')
@Controller('bonus')
export class BonusController {    
    constructor(private readonly bonusService: BonusService) {}

    @ApiOperation({ summary: 'Получить список всех бонусов' })
    @ApiResponse({ status: 200 })
    @Get()
    getMe() {
        return this.bonusService.getAll();
    }

    @ApiOperation({ summary: 'Сохранить бонус' })
    @ApiResponse({ status: 200 })
    @Post()
    populate(@Body() data) {
        return this.bonusService.save(data);
    }

    @ApiOperation({ summary: "Delete bonus" })
    @ApiResponse({ status: 200 })
    @Delete()
    deleteFavorite(@Body() data) {
        return this.bonusService.delete(data.id);
    }

}