import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Notification } from './notification.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor ( 
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>
    ) {}

    async save(notification) {
        return await this.notificationRepository.save(notification)
    }

    async getAllById(userId: number){
        return await this.notificationRepository.find({
            where: {userId},
            order: {id: "DESC"}}
        )
    }

}