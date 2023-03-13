import { Entity, Column } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Specialization extends AppEntity {

    @ApiProperty()
    @Column()
    name: string;

}