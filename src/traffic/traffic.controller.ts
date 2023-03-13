import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TrafficService } from './traffic.service';
import { Traffic } from './traffic.model';

@ApiTags('Traffic')
@Controller('traffic')
export class TrafficController {
    constructor(private trafficService: TrafficService) {}

    @ApiOperation({ summary: 'Получить список трафика' })
    @ApiResponse({ status: 200, type: [Traffic] })
    @Get()
    async getAllTraffic() {
        return await this.trafficService.getAll();
    }

}