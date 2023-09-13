import { ApiProperty } from "@nestjs/swagger";

// sent to client
export class PurchaseCodeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  item: {
    itemId: number;
    itemName: string;
    itemSubscriptionLength: number;
  }

  @ApiProperty()
  priceOff: number;
}

// received from client for new purchase code
export class PurchaseCodeFormValues {
  @ApiProperty()
  name: string;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  priceOff: number;
}