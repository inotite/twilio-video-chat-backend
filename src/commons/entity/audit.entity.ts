import { Entity, Column, BeforeInsert, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export abstract class Audit {

    @ApiProperty()
    @CreateDateColumn()
    createdAt: number;

    @ApiProperty()
    @CreateDateColumn()
    updatedAt: number;
}