import { AxiosResponse } from "axios"
import { request } from "./baseRequest"
import { Subscription, User } from "../entities"

export function getUserSubscriptions(): Promise<AxiosResponse<Subscription[]>> {
    return request({
        method: 'get',
        url: `api/subscription/user`
    })
}

export function getOwnerSubscriptions(): Promise<AxiosResponse<Subscription[]>> {
    return request({
        method: 'get',
        url: `api/subscription/owner`
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

export async function updateInformation(data:any): Promise<AxiosResponse<User>> {
    return request ({
        method : 'post',
        url: `api/auth/update-information`,
        data: data
    })
}

export function getUserInfoById(id: number): Promise<AxiosResponse<User>> {
    return request ({
        method : 'get',
        url: `api/user/${id}`,
    })
}