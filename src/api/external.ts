import { api } from './http'

export interface ExternalData {
    fact: string
    length: number
}

export const getExternalData = async (): Promise<ExternalData> => {
    const { data } = await api.get('/external-data')
    return data.data
}
