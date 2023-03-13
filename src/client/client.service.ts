import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Client } from './client.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllClient() {
    return this.clientRepository.find({ relations: ['user'] })
  }

  async save(client: Client) {
    return this.clientRepository.save( client );
  }

  async getClientById(userId: number) {
    return await this.clientRepository.findOne({
        where: {userId}
    })
  }

  async checkReferralCode(referralCode: string) {
    return await this.clientRepository.findOne({
        where: {referralCode}
    })
  }

}