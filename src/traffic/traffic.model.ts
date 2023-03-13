import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Traffic extends AppEntity {

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty()
    @Column({nullable: true})
    userId: number;

    @ApiProperty()
    @Column({nullable: true})
    duration: number;

}