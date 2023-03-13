import {
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service'
import { OperatorService } from '../operator/operator.service'
import { ClientService } from '../client/client.service'
import { MailService } from '../mailer/mail.service'

import { User } from '../user/user.model'

@Injectable()
export class AuthService {
    
    constructor(
        private userService: UserService,
        private operatorService: OperatorService,
        private clientService: ClientService,
        private mailService: MailService
    ) {}

    async login(login: string, password: string) {
        let user = await this.userService.getUserByLogin(login)
        if (!user || user.isBanned === 1) throw new HttpException('Неверные данные авторизации', HttpStatus.BAD_REQUEST)
        return user
    }

    async register(data){
        let candidate = await this.userService.getUserByLogin(data.login)
        if (candidate) throw new HttpException('Пользователь с таким логином существует', HttpStatus.BAD_REQUEST)
        data.referralCode = await this.generateRandomString(6);
        const user = await this.userService.saveUser(data);
        if (data.role === 'OPERATOR') {
            const operator = { user, ...data}
            return await this.operatorService.save(operator)
        }
        if (data.role === 'CLIENT') {
            const referralCheckUser = await this.clientService.checkReferralCode(data.referral);
            if (referralCheckUser && data.referral) data.referralUserId = referralCheckUser.userId
            const client = { user, ...data}
            return await this.clientService.save(client)
        }
        return user;
    }

    async generateRandomString(len: number) {
        let str = '';
        let charsList = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789';
        for (let i = 0; i < len; i++) {
            let pos = Math.floor(Math.random() * charsList.length);
            str += charsList.substring(pos,pos+1);
        }
        return str;
    }

    async updateBaseData(data){
        const user = await this.userService.getUserByLogin(data.login);
        user.nickname = data.FIO;
        user.password = data.password; 
        user.birth = data.years; 
        const updateUser = await this.userService.saveUser(user);
        return updateUser;
      }

      async restorePassword(data){

        const user = await this.userService.getUserByLogin(data.login);
        console.log('restore USER', user);
        const code = await this.generateRandomString(10);
        user.password = code
        const sendMa = await this.mailService.sendForgotPassword(user.login, user.password);
        const updateUser = await this.userService.saveUser(user);
        return updateUser;
    
      }

      async sendConfirmCodeEmail(userId: number){

        const user = await this.userService.getUserById(userId);
        const code = Math.floor(Math.random() * (9999-1000))+1000;
        console.log('sendCode', user);
        const sendMa = await this.mailService.sendCode(user.login, code);
        return code;
    
      }

      async confirmProfile(data){

        const user = await this.userService.getUserByLogin(data.login);
        user.isSuccessful = true;
        console.log('usrr', user);
        const updateUser = await this.userService.saveUser(user);
        console.log('usrr', user);
        return updateUser;
    
      }
}