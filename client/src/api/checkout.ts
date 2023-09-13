import { AxiosResponse } from "axios"
import PurchaseCode from "../entities/purchaseCode"
import { request } from "./baseRequest"

export function getCurrentItem(data:any):Promise<any> {
    return request({
        method: 'GET',
        url: `api/item/${data}`,
        data: data
    })
}

export function validatePurchaseCode(data: {name: string, itemId: number}): Promise<AxiosResponse<PurchaseCode>> {
    return request({
        method: 'POST',
        url: `api/purchaseCode/validate`,
        data: data
    })
}
