import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Review extends AppEntity {

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn()
    client: User;

    @ApiProperty()
    @Column()
    clientId: number;

    @ApiProperty()
    @Column()
    operatorId: number;

    @ApiProperty()
    @Column()
    review: string;

    @ApiProperty()
    @Column()
    grade: number;

}