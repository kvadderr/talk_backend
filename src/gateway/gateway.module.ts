import { forwardRef, Module } from '@nestjs/common';
import { SocketService } from './gateway.service';
import { TrafficModule } from '../traffic/traffic.module'

@Module({
    imports: [ 
        forwardRef(() => TrafficModule),
    ],
    providers: [SocketService],
    exports: [SocketService],
})
export class GatewayModule {}