import { ApiProperty } from "@nestjs/swagger";

export class PaypalPayload{

    @ApiProperty()
    scope: string;

    @ApiProperty()
    access_token: string;

    @ApiProperty()
    token_type: string;

    @ApiProperty()
    app_id: string;

    @ApiProperty()
    expires_in: number;

    @ApiProperty()
    nonce: string
  }