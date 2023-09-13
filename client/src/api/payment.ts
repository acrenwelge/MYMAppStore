import { AxiosResponse } from "axios"
import { CartDataDto, PayPalOrderDetails, PaypalCreateOrderResponse } from "../entities/orders"
import { request } from "./baseRequest"

export function createPaypalOrder(cart: CartDataDto): Promise<AxiosResponse<PaypalCreateOrderResponse>> {
    return request({
        method: 'post',
        url: `/api/payment/create-paypal-order`,
        data: cart
    })
}

export function capturePaypalOrder(orderData: PayPalOrderDetails): Promise<AxiosResponse<any>> {
    return request ({
        method : 'post',
        url: `/api/payment/capture-paypal-order`,
        data: orderData
    })
}
