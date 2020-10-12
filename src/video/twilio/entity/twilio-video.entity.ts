import { Entity, PrimaryGeneratedColumn, Long, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Audit } from "src/commons/entity/audit.entity";

@Entity()
export class TwilioVideo extends Audit{

    @PrimaryGeneratedColumn()
    id: Long;

    @ApiProperty()
    @Column()
    eventId: number;

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column()
    username: string;

    @ApiProperty()
    @Column()
    eventName: string;
}