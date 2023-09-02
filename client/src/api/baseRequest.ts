import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const http = axios.create({
    baseURL: process.env.REACT_APP_API_PATH,
    timeout: 10000,
})

http.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';

        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

export function request<ResponseType>(config: AxiosRequestConfig): Promise<AxiosResponse<ResponseType>> {
    console.log("REQUEST BODY: ",config.data)
    return http(config)
}

