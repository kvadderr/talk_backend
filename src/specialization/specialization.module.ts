import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SpecializationService } from './specialization.service'
import { SpecializationController } from './specialization.controller'
import { Specialization } from './specialization.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialization]),
  ],
  providers: [SpecializationService],
  controllers: [SpecializationController],
  exports: [SpecializationService, SpecializationModule]
})
export class SpecializationModule {}
