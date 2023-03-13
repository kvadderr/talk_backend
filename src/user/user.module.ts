import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GatewayModule } from '../gateway/gateway.module'
import { BonusModule } from '../bonus/bonus.module'
import { NotificationModule } from '../notification/notification.module'
import { ClientModule } from '../client/client.module'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => GatewayModule),
    forwardRef(() => BonusModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ClientModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, UserModule]
})
export class UserModule {}
