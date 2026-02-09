import { api } from './http'

export interface TaskStats {
    total: number
    by_status: {
        completed: number
        in_progress: number
        new: number
    }
}

export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    roles: string[]
    created_at: string
    updated_at: string
}

export const getTaskStats = async (userId?: number): Promise<TaskStats> => {
    const params = userId ? { user_id: userId } : {}
    const { data } = await api.get('/tasks-stats', { params })
    return data
}

export const getUsers = async (): Promise<User[]> => {
    const { data } = await api.get('/users')
    return data.data
}
