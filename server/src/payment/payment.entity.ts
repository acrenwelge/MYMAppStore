export default interface Cart {
  purchaserUserId: number,
  grandTotal: number,
  items: {
    itemId: number,
    quantity: number,
    purchaseCode: string,
  }[]
}

export interface PaypalCreateOrderResponse {
  id: string,
  status: string,
  links: {
    href: string,
    rel: string,
    method: string,
  }[]
}

export interface PayPalOrderDetails {
  orderId: string,
  cart: Cart,
}