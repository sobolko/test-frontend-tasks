import { api } from './http'

export interface Task {
    id: number
    user_id: number
    user_name: string
    title: string
    status: 'new' | 'in_progress' | 'completed'
    status_label: string
    created_at: string
    updated_at: string
}

export interface TasksResponse {
    data: Task[]
    links: {
        first: string
        last: string
        prev: string | null
        next: string | null
    }
    meta: {
        current_page: number
        from: number
        last_page: number
        links: Array<{
            url: string | null
            label: string
            page: number | null
            active: boolean
        }>
        path: string
        per_page: number
        to: number
        total: number
    }
}

export const getTasks = async (
    page = 1,
    perPage = 10,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
): Promise<TasksResponse> => {
    const params: any = { page, per_page: perPage }
    if (sortBy) {
        params.sort_by = sortBy
        params.sort_order = sortOrder || 'asc'
    }

    console.log('API request params:', params)

    const { data } = await api.get('/tasks', { params })
    return data
}

export const getTaskById = async (id: number): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`)
    return data.data
}

export const updateTaskStatus = async (id: number, status: Task['status']): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}`, { status })
    return data.data
}

export interface CreateTaskData {
    title: string
}

export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    const { data } = await api.post('/tasks', taskData)
    return data.data
}
