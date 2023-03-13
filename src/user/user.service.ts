import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../gateway/gateway.service';
import { BonusService } from '../bonus/bonus.service'
import { NotificationService } from '../notification/notification.service'
import { ClientService } from '../client/client.service'

@Injectable()
export class UserService {
    constructor ( 
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private socketService: SocketService,
        private bonusService: BonusService,
        private notificationService: NotificationService,
        private clientService: ClientService
    ) {}

    async saveUser(user: User) {
        const savedUser = await this.userRepository.save(user);
        if (!savedUser) throw new HttpException ({ message: 'Ошибка при сохранении пользователя' }, HttpStatus.BAD_REQUEST);
        return savedUser;
    }

    async getUserByLogin(login: string) {
        return await this.userRepository.findOne({
            where: {login}
        })
    }

    async getUserById(id: number) {
        return await this.userRepository.findOne({
            where: {id}
        })
    }

    async populateBalance(id: any, balance: number){
        const user = await this.getUserById(id)
        user.balance = +user.balance + +balance
        this.socketService.socket.in(id).emit('updateBalance', user.balance)
        const detail = balance > 0 ? "Вам зачислен баланс": "Списан баланс"
        await this.notificationService.save({userId: user.id, detail: detail , amount: balance})
        return await this.saveUser(user)
    }

    async payment(id: number, amount: number){
        const user = await this.getUserById(id);
        const client = await this.clientService.getClientById(id) 
        let bonus = 0
        const bonusList = await this.bonusService.getAll();
        bonusList.map( element => {
            if (amount >= element.amount) bonus = element.bonus
        })
        this.populateBalance(id, amount);
        if (bonus > 0) {
            this.populateBonus(id, bonus)
        }
        if (client.referralUserId && !client.usedReferralCode) {
            await this.notificationService.save({userId: id, detail: "Вам зачислены бонусы", amount: bonus})
            this.populateBonus(client.referralUserId, amount)
            await this.notificationService.save({userId: id, detail: "Вашей реферальной ссылкой успешно воспользовались"})
            client.usedReferralCode = true
            this.clientService.save(client)        
        } 
        return bonus;
    }

    async populateBonus(id: any, bonus: number){
        const user = await this.getUserById(id);
        user.bonus = +user.bonus + +bonus; 
        this.socketService.socket.in(id).emit('updateBonus', user.bonus);
        const detail = bonus > 0 ? "Вам зачислены бонусы": "Списаны бонусы"
        await this.notificationService.save({userId: id, detail: detail, amount: bonus})
        return await this.saveUser(user);
    }

    async banUser(id: number, isBanned: number, banCause: string) {
        await this.userRepository.update(id, { isBanned: isBanned, banCause: banCause })
        await this.notificationService.save({userId: id, detail: "Your profile is banned"})
    }

    async restorePassword(id: number, newPassword: string){
        await this.userRepository.update(id, { password: newPassword })
        await this.notificationService.save({userId: id, detail: "Your password is restored"})
    }

    async updateAvatar(data: any){
        await this.userRepository.update(data.userId, { avatar: data.filename })
    }

}