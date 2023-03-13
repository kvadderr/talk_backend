import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    ManyToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Client extends AppEntity {
    
    @ApiProperty({
        type: () => User,
    })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    referralCode: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    referralUserId: number;

    @ApiProperty()
    @Column({
        nullable: true,
        default: false
    })
    usedReferralCode: boolean;

}