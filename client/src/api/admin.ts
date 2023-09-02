import { Axios, AxiosResponse } from "axios";
import PurchaseCode from "../entities/purchaseCode";
import { PurchaseCodeFormValues } from "../pages/Admin/PurchaseCode";
import { request } from "./baseRequest"
import User from "../entities/user";

export function getAllUserData(): Promise<AxiosResponse<User[]>> {
    return request<User[]>({
        method: 'GET',
        url: `api/admin/user`,
    })
}

export function updateUser(data: User): Promise<AxiosResponse<User>> {
    return request<User>({
        method: 'PUT',
        url: `api/admin/user/${data.userId}`,
        data: data
    });
}

export function sendAccountActivationEmail(data: any):Promise<any> {
    console.log('user:', data);
    return request({
        method: 'POST',
        url: `api/admin/user/${data.id}/sendActivateEmail`,
        data: data
    });
}

export function deleteUser(id: number):Promise<any> {
    return request({
        method: 'DELETE',
        url: `api/admin/user/${id}`,
    })
}

export function getAllPurchaseCodeData():Promise<any>{
    return request({
        method: 'GET',
        url: 'api/purchaseCode',
    })
}

export function getAllEmailSubscriptionData():Promise<any>{
    return request({
        method: 'GET',
        url: 'api/admin/emailSubscription',
    })
}

export function getTransactionRecordData():Promise<any>{
    return request({
        method: 'GET',
        url: 'api/admin/transaction',
    })
}

export function getAllItemData():Promise<any>{
    return request({
        method: 'GET',
        url: 'api/item',
    })
}

export function addCodeApi(data:any):Promise<any> {
    return request({
        method: 'POST',
        url: `api/purchaseCode`,
        data:data
    })
}

export function deleteCodeApi(id: number): Promise<any> {
    return request({
        method: 'DELETE',
        url: `api/purchaseCode/${id}`
    })
}

export function updateCodeApi(data: PurchaseCodeFormValues): Promise<AxiosResponse<PurchaseCode>> {
    return request({
        method: 'PUT',
        url: `api/purchaseCode/${data.code_id}`,
        data: data
    })
}

export function addEmailSubApi(data:any):Promise<any> {
    return request({
        method: 'POST',
        url: `api/admin/add-emailsub`,
        data: data
    })
}

export function deleteEmailSubApi(data:any):Promise<any> {
    console.log("client admin");
    console.log(data);
    return request({
        method: 'POST',
        url: `api/admin/delete-emailsub`,
        data: data
    })
}

export function updateEmailSubApi(data:any):Promise<any> {
    return request({
        method: 'POST',
        url: `api/admin/update-emailsub`,
        data: data
    })
}


export function getItem(data:any):Promise<any> {
    return request ({
        method : 'GET',
        url: `api/item/id`,
        data: data
    })
}

export function getPurchaseCode(data:any):Promise<any> {
    return request ({
        method : 'GET',
        url: `api/purchaseCode/id`,
        data: data
    })
}
