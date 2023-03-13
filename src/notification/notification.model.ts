import { Entity, Column } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Notification extends AppEntity {

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column({
        nullable: true,
        type: 'numeric', 
        precision: 10, 
        scale: 2
    })
    amount: number;

    @ApiProperty()
    @Column()
    detail: string;

}