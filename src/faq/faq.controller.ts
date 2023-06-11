import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FAQService } from './faq.service';
import { FAQ } from './faq.model';

@ApiTags('FAQ')
@Controller('faq')
export class FAQController {
  constructor(private faqService: FAQService) {}

  @ApiOperation({ summary: 'Список всех пунктов FAQ' })
  @ApiResponse({ status: 200, type: [FAQ] })
  @Get()
  async getAllOperator() {
    return await this.faqService.getAll();
  }

  @ApiOperation({ summary: 'Добавить или сохранить пункт' })
  @ApiResponse({ status: 200, type: [FAQ] })
  @Post()
  async updateOperator(@Body() data) {
    return await this.faqService.create(data);
  }

  @ApiOperation({ summary: "Delete FAQ" })
    @ApiResponse({ status: 200 })
    @Delete()
    deleteFavorite(@Body() data) {
        return this.faqService.delete(data.id);
    }

}