import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Traffic } from './traffic.model'

@Injectable()
export class TrafficService {
    constructor( @InjectRepository(Traffic) private trafficRepository: Repository<Traffic> ) {}

    async getAll() {
        return this.trafficRepository.find()
    }

    async save(traffic) {
        return await this.trafficRepository.save(traffic)
    }
}