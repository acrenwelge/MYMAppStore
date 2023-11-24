import { ApiProperty } from "@nestjs/swagger";
import { ItemDto } from "src/item/item.dto";
import { UserDto } from "src/user/user.dto";

export class SubscriptionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  item: ItemDto;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  owner: UserDto;
}
