import { request } from "./baseRequest"

export function getUserSubscriptions():Promise<any> {
    return request({
        method: 'get',
        url: `api/subscription`
    })
}

export function getProfileApi():Promise<any> {
    return request ({
        method : 'get',
        url: `api/auth/profile`
    })
}

export function getItem(data:any):Promise<any> {
    return request ({
        method : 'get',
        url: `api/item/id`,
        data: data
    })
}