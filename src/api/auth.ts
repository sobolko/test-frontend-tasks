import { api } from './http'

export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    roles: string[]
    created_at: string
    updated_at: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: User
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post('/login', credentials)
    return data
}

export const logout = async (): Promise<void> => {
    await api.post('/logout')
}

export const getUser = async (): Promise<User> => {
    const { data } = await api.get('/user')
    return data
}
