import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Entity, Column } from 'typeorm'

import { AppEntity } from '../base/BaseEntity'

@Entity()
export class User extends AppEntity {

    @ApiProperty()
    @Column()
    login: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column()
    nickname: string;

    @ApiProperty()
    @Column()
    role: string;

    @ApiProperty()
    @Column({
        default: 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
    })
    avatar: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    birth: number;

    @ApiProperty()
    @Column({
        default: 0,
        type: 'numeric', 
        precision: 10, 
        scale: 2
    })
    balance: number;

    @ApiProperty()
    @Column({
        default: 0,
        type: 'numeric', 
        precision: 10, 
        scale: 2
    })
    bonus: number;

    @ApiProperty()
    @Column({
        default: 0
    })
    isBanned: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    banCause: string;

    @ApiProperty()
    @Column({
        default: false
    })
    isConfirmed: boolean;

    @ApiProperty()
    @Column({
        default: false
    })
    isSuccessful: boolean;

}

