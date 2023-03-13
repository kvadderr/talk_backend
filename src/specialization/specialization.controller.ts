import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpecializationService } from './specialization.service';
import { Specialization } from './specialization.model'

@ApiTags('Specialization')
@Controller('specialization')
export class SpecializationController {    
    constructor(private readonly specializationService: SpecializationService) {}

    @ApiOperation({ summary: 'Получить список всех специализаций' })
    @ApiResponse({ status: 200 })
    @Get()
    getMe() {
        return this.specializationService.getAll();
    }

    @ApiOperation({ summary: 'Сохранить специализацию' })
    @ApiResponse({ status: 200 })
    @Post()
    populate(@Body() data) {
        return this.specializationService.save(data);
    }

    @ApiOperation({ summary: "Delete specialization" })
    @ApiResponse({ status: 200 })
    @Delete()
    deleteFavorite(@Body() data) {
        return this.specializationService.delete(data.id);
    }


}