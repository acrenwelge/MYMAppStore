import { AxiosResponse } from "axios"
import Class from "../entities/class"
import { ExpandedClass } from "../entities"
//import User from "../entities/user"
import { request } from "./baseRequest"

export function createClass(instructorId: number): Promise<AxiosResponse<ExpandedClass>> {
    return request({
        method: 'POST',
        url: `api/classes/new/${instructorId}`
    })
}

export function getClasses(): Promise<AxiosResponse<Class[]>> {
    return request({
        method: 'GET',
        url: `api/classes`,
    })
}

export function getClassById(classId: number): Promise<AxiosResponse<ExpandedClass>> {
    return request({
        method: 'GET',
        url: `api/classes/${classId}`,
    })
}

export function getClassByInstructor(instructorId: number): Promise<AxiosResponse<ExpandedClass>> {
    return request({
        method: 'GET',
        url: `api/classes/instructor/${instructorId}`,
    })
}

// export function givenUserIsInstructor(userId: number): Promise<AxiosResponse<User>> {
//     return request({
//         method: 'GET',
//         url: 'api/classes/instructor/query/${userId}',
//     })
// }

export function removeStudentFromClass(classId: number, studentUserId: number): Promise<AxiosResponse<ExpandedClass>> {
    return request({
        method: 'DELETE',
        url: `api/classes/${classId}/student/${studentUserId}`,
    })
}

export function addStudentToClassByEmail(classId: number, studentEmail: string): Promise<AxiosResponse<ExpandedClass>> {
    return request({
        method: 'POST',
        url: `api/classes/${classId}/student`,
        data: {
            email: studentEmail
        }
    })
}