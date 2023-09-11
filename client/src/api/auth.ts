import { AxiosResponse } from "axios";
import { User } from "../entities";
import { request } from "./baseRequest"

export function localLoginApi(data:any):Promise<any> {
    console.log(data);
    return request({
        method: 'post',
        url: `api/auth/local-login`,
        data: data
    })
}

export async function localSignupApi(data:any): Promise<AxiosResponse<User>> {
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
