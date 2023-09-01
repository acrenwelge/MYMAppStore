import { ApiProperty } from "@nestjs/swagger";

export class PurchaseCodeDto {
  @ApiProperty()
  codeId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  item?: { // not required on updates
    itemId: number;
    itemName?: string; // not required from client, but sent in response
  }

  @ApiProperty()
  priceOff: number;
}