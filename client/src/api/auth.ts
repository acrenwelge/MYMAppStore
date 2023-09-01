import { request } from "./baseRequest"

export function localLoginApi(data:any):Promise<any> {
    console.log(data);
    return request({
        method: 'post',
        url: `api/auth/local-login`,
        data: data
    })
}

export function localSignupApi(data:any):Promise<any> {
    return request ({
        method : 'post',
        url: `api/auth/local-signup`,
        data: data
    })
}

export function localSignupApiClass(data:any):Promise<any> {
    console.log('sending JSON data:',data)
    return request ({
        method : 'post',
        url: `api/auth/class-signup`,
        data: data
    })
}

export function activateUser(data:any):Promise<any> {
    return request({
        method: 'post',
        url: `api/auth/activate`,
        data: data,
    })
}
