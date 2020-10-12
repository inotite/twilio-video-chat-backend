import { ApiProperty } from "@nestjs/swagger";

export class UserDto{

    @ApiProperty()
    password: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;
}