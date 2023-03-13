import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bonus } from './bonus.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BonusService {
    constructor ( 
        @InjectRepository(Bonus) private bonusRepository: Repository<Bonus>
    ) {}

    async save(bonus) {
        return await this.bonusRepository.save(bonus)
    }

    async getAll(){
        return await this.bonusRepository.find()
    }

    async delete(id: number){
        const bonus = await this.bonusRepository.findOne({
            where: { id }
          })
        return this.bonusRepository.remove(bonus)
    }

}