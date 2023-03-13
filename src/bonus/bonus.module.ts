import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BonusService } from './bonus.service'
import { BonusController } from './bonus.controller'
import { Bonus } from './bonus.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([Bonus]),
  ],
  providers: [BonusService],
  controllers: [BonusController],
  exports: [BonusService, BonusModule]
})
export class BonusModule {}
