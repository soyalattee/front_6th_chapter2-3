import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"

const API_BASE_URL = "/api"

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", //다른 케이스 없으니 고정
  },
})

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    // 공통 에러 처리 하기
    console.error("API Error:", err.response?.status, err.message)
    throw err
  },
)

export const api = {
  get: async <T>(path: string, options?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(path, options)
    return response.data
  },
  post: async <T, D>(path: string, data?: D, options?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(path, data, options)
    return response.data
  },
  put: async <T, D>(path: string, data?: D, options?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(path, data, options)
    return response.data
  },
  delete: async <T>(path: string, options?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(path, options)
    return response.data
  },
  patch: async <T, D>(path: string, data?: D, options?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(path, data, options)
    return response.data
  },
}
