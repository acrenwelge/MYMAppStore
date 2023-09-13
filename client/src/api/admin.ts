import { AxiosResponse } from "axios";
import PurchaseCode from "../entities/purchaseCode";
import { PurchaseCodeFormValues } from "../pages/Admin/AdminPurchaseCodePage";
import { request } from "./baseRequest"
import User from "../entities/user";
import { Product, Subscription } from "../entities";
import FreeSubscription from "../entities/freeSubscription";
import Transaction from "../entities/transaction";

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

export function getAllTransactions(): Promise<AxiosResponse<Transaction[]>> {
    return request({
        method: 'GET',
        url: 'api/transaction',
    })
}

export function getAllProductData(): Promise<AxiosResponse<Product[]>> {
    return request({
        method: 'GET',
        url: 'api/item',
    })
}

export function getProduct(data:any): Promise<any> {
    return request ({
        method : 'GET',
        url: `api/item/id`,
        data: data
    })
}

export function getPurchaseCode(name: string): Promise<AxiosResponse<PurchaseCode>> {
    return request ({
        method : 'GET',
        url: `api/purchaseCode/${name}`,
    })
}

export function addPurchaseCodeApi(data: PurchaseCodeFormValues): Promise<AxiosResponse<PurchaseCode>> {
    return request({
        method: 'POST',
        url: `api/purchaseCode`,
        data: data
    })
}

export function deleteCodeApi(name: string): Promise<AxiosResponse<null>> {
    return request({
        method: 'DELETE',
        url: `api/purchaseCode/${name}`
    })
}

export function updateCodeApi(name: string, newCode: PurchaseCodeFormValues): Promise<AxiosResponse<PurchaseCode>> {
    return request({
        method: 'PUT',
        url: `api/purchaseCode/${name}`,
        data: newCode
    })
}

export function getAllSubscriptions(): Promise<AxiosResponse<Subscription[]>> {
    return request({
        method: 'GET',
        url: 'api/subscription/all',
    })
}

export function getSubsForCurrentUser(): Promise<AxiosResponse<Subscription[]>> {
    return request({
        method: 'GET',
        url: 'api/subscription',
    });
}

export function getAllFreeSubs(): Promise<AxiosResponse<FreeSubscription[]>> {
    return request({
        method: 'GET',
        url: 'api/admin/free-subscription',
    })
}

export function addFreeSub(data: {suffix: string}): Promise<AxiosResponse<FreeSubscription>> {
    return request({
        method: 'POST',
        url: `api/admin/free-subscription`,
        data: data
    })
}

export function deleteFreeSub(id: number): Promise<AxiosResponse<FreeSubscription>> {
    return request({
        method: 'DELETE',
        url: `api/admin/free-subscription/${id}`
    })
}

export function updateFreeSub(data: FreeSubscription): Promise<AxiosResponse<FreeSubscription>> {
    return request({
        method: 'PUT',
        url: `api/admin/free-subscription/${data.email_sub_id}`,
        data: {suffix: data.suffix}
    })
}
