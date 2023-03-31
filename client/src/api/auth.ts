import { request } from "./baseRequest"

export function localLoginApi(data:any):Promise<any> {
    return request({
        method: 'post',
        url: `api/auth/local-login`,
        data:data
    })
}