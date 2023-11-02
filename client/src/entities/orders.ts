import { CartItem } from "./product"

export interface PayPalOrderDetails {
  orderId: string,
  cart: CartDataDto,
  recipientIds: number[]
}

export interface CartDataDto {
  purchaserUserId: number,
  grandTotal: number,
  items: CartItem[]
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