import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Operator } from '../operator/operator.model'

@Entity()
export class Favorite extends AppEntity {

    @ApiProperty({
        type: () => Operator,
    })
    @OneToOne(() => Operator)
    @JoinColumn()
    operator: Operator;

    @ApiProperty()
    @Column()
    operatorId: number;

    @ApiProperty()
    @Column()
    userId: number;

}