import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    ManyToOne,
    JoinTable
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'
import { Specialization } from '../specialization/specialization.model'

@Entity()
export class Operator extends AppEntity {
    @ApiProperty()
    @Column({
        default: 0,
        type: 'numeric', 
        precision: 10, scale: 2 
    })
    price: number;

    @ApiProperty()
    @Column({
        default: 0
    })
    percent: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    brief: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    dateOfBirth: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    aboutMe: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    goals: string;

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
        default: 'Offline'
    })
    status: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    audio: string;

    @ManyToMany(() => Specialization, {
        eager: true,
      })
    @JoinTable()
    specializations: Specialization[];

}