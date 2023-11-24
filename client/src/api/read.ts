import { request } from "./baseRequest"

export function readBook(name: string):Promise<any> {
    return request({
        method: 'get',
        url: `api/book/read/${name}`,
    })
}

export function getAllPurchaseCodeData():Promise<any>{
    return request({
        method: 'get',
        url: 'api/admin/purchaseCode',
    })
}



