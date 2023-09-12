import { ApiProperty } from "@nestjs/swagger";
import { ItemDto } from "src/item/item.dto";
import { PurchaseCodeDto } from "src/purchaseCode/purchaseCode.dto";
import { UserDto } from "src/user/user.dto";

export class TransactionDetailDto {
    txDetailId?: number;
    item: ItemDto;
    purchaseCode?: PurchaseCodeDto;
    finalPrice: number;
}

export class TransactionDto {
    @ApiProperty()
    public txId: number;

    @ApiProperty()
    public transactionDetails: TransactionDetailDto[];

    @ApiProperty()
    public user: UserDto;

    @ApiProperty()
    public total: number;

    @ApiProperty()
    public date: Date;
}
