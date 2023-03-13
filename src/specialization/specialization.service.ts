import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Specialization } from './specialization.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SpecializationService {
    constructor ( 
        @InjectRepository(Specialization) private specializationRepository: Repository<Specialization>
    ) {}

    async save(specialization) {
        return await this.specializationRepository.save(specialization)
    }

    async getAll(){
        return await this.specializationRepository.find()
    }

    async delete(id: number){
        const specialization = await this.specializationRepository.findOne({
            where: { id }
        })
        return this.specializationRepository.remove(specialization)
    }

}