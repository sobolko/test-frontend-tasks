import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    login as loginApi,
    logout as logoutApi,
    getUser as getUserApi,
    type User,
    type LoginRequest,
} from '@/api/auth'
import { getExternalData, type ExternalData } from '@/api/external'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
    const user = ref<User | null>(null)
    const loading = ref(false)
    const externalData = ref<ExternalData | null>(null)
    const externalDataLoading = ref(false)

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)

    async function login(credentials: LoginRequest): Promise<void> {
        loading.value = true
        try {
            const response = await loginApi(credentials)
            token.value = response.token
            user.value = response.user
            localStorage.setItem(TOKEN_KEY, response.token)

            // Получаем внешние данные после успешного логина
            await fetchExternalData()
        } finally {
            loading.value = false
        }
    }

    async function logout(): Promise<void> {
        loading.value = true
        try {
            if (token.value) {
                await logoutApi()
            }
        } catch (error) {
            console.warn('Logout API call failed:', error)
        } finally {
            token.value = null
            user.value = null
            externalData.value = null
            localStorage.removeItem(TOKEN_KEY)
            loading.value = false
        }
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return

        try {
            user.value = await getUserApi()
        } catch (error) {
            console.error('Failed to fetch user:', error)
            // Token might be invalid, clear auth state
            await logout()
        }
    }

    async function fetchExternalData(): Promise<void> {
        externalDataLoading.value = true
        try {
            externalData.value = await getExternalData()
        } catch (error) {
            console.error('Failed to fetch external data:', error)
        } finally {
            externalDataLoading.value = false
        }
    }

    // Initialize user on store creation if token exists
    if (token.value && !user.value) {
        fetchUser()
    }

    return {
        token,
        user,
        loading,
        externalData,
        externalDataLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        fetchUser,
        fetchExternalData,
    }
})
