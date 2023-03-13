import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Operator } from './operator.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service'

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return this.operatorRepository.find({ relations: ['user', 'specializations'] });
  }

  async getTopOperator(){
    const [data, total] = await this.operatorRepository.findAndCount({
      take: 3,
      skip: 0,
      relations: ['user', 'specializations'],
    });

    return data;
  }

  async getOperatorById(userId: number) {
    return await this.operatorRepository.findOne({
        where: {userId}
    })
  }

  async updateData(data){
    const userId = data.userId;
    const operator = await this.operatorRepository.findOne({
      where: { userId }
    });

    operator.brief = data.brief;
    operator.aboutMe = data.aboutMe;
    operator.goals = data.goals;
    return await this.operatorRepository.save(operator);

  }

  async save(operator: Partial<Operator>) {
    return this.operatorRepository.save( operator );
  }

  async loadAudio(data: any){
    console.log(data);
    return await this.operatorRepository.update({userId: data.userId},{ audio: data.filename }) 
  }

  async updateStatus(userId: number, newStatus: string){
    console.log(userId, newStatus);
    return await this.operatorRepository.update({userId: userId}, { status: newStatus }) 
  }

}