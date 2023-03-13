import { Entity, Column } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Bonus extends AppEntity {

    @ApiProperty()
    @Column()
    amount: number;

    @ApiProperty()
    @Column()
    bonus: number;

}