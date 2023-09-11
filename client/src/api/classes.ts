import { AxiosResponse } from "axios"
import Class from "../entities/class"
import { request } from "./baseRequest"

export function getClasses(): Promise<AxiosResponse<Class[]>> {
    return request({
        method: 'GET',
        url: `api/classes`,
    })
}

export function getClassById(classId: number): Promise<AxiosResponse<Class>> {
    return request({
        method: 'GET',
        url: `api/classes/${classId}`,
    })
}

export function getClassByInstructor(instructorId: number): Promise<AxiosResponse<Class>> {
    return request({
        method: 'GET',
        url: `api/classes/instructor/${instructorId}`,
    })
}

export function removeStudentFromClass(classId: number, studentUserId: number): Promise<AxiosResponse<Class>> {
    return request({
        method: 'DELETE',
        url: `api/classes/${classId}/student/${studentUserId}`,
    })
}

export function addStudentToClassByEmail(classId: number, studentEmail: string): Promise<AxiosResponse<Class>> {
    return request({
        method: 'POST',
        url: `api/classes/${classId}/student`,
        data: {
            email: studentEmail
        }
    })
}