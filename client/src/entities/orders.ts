export interface CartDataDto {
  purchaserUserId: number,
  grandTotal: number,
  items: {
    itemId: number,
    quantity: number,
    purchaseCode: string | null,
  }[]
}

export interface PaypalCreateOrderResponse {
  id: number,
  status: string,
  links: {
    href: string,
    rel: string,
    method: string,
  }[]
}

export interface PayPalOrderDetails {
  orderId: string,
  cart: CartDataDto,
}