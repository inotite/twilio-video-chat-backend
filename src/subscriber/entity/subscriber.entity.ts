import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Audit } from "src/commons/entity/audit.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Event } from '../../event/entity/events.entity';

@Entity()
export class Subscriber extends Audit{

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column()
    eventId: number;

    @ApiProperty()
    @Column()
    subscriptionDate: string;

    @ApiProperty({type: () => Event})
    @ManyToOne(type => Event, event => event.subscribers)
    event: Event

}