import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_API_PATH


const service = axios.create({
    baseURL:baseURL,
    timeout:10000,
})

service.interceptors.request.use(
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

service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

export function request(config:AxiosRequestConfig):Promise<AxiosResponse> {
    return service(config)
}

