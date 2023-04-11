import { request } from "./baseRequest"

export function getRecords():Promise<any> {
    return request({
        method: 'get',
        url: `api/record/record`
    })
}


export function getProfileApi():Promise<any> {
    return request ({
        method : 'get',
        url: `api/auth/profile`
    })
}


