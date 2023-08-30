import { AxiosResponse } from "axios";
import PurchaseCode from "../entities/purchaseCode";
import { PurchaseCodeFormValues } from "../pages/Admin/PurchaseCode";
import { request } from "./baseRequest"
import { METHODS } from "http";

export function getAllUserData():Promise<any> {
    return request({
        method: 'GET',
        url: `api/admin/user`,
    })
}

export function updateUser(data: any):Promise<any> {
    return request({
        method: 'PUT',
        url: `api/admin/user/${data.id}`,
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
        url: 'api/admin/purchaseCode',
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
        url: `api/admin/add-code`,
        data:data
    })
}

export function deleteCodeApi(data:any):Promise<any> {
    return request({
        method: 'POST',
        url: `api/admin/delete-code`,
        data:data
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
