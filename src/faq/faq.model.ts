import { Entity, Column } from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class FAQ extends AppEntity {

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    detail: string;
    
}