<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth/auth.store'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const message = useMessage()
const auth = useAuthStore()

// Redirect if already authenticated
if (auth.isAuthenticated) {
    router.push('/dashboard')
}

async function handleSubmit() {
    error.value = ''

    if (!email.value || !password.value) {
        error.value = 'Заполните все поля'
        return
    }

    try {
        await auth.login({
            email: email.value,
            password: password.value,
        })

        message.success('Вход выполнен успешно')
        router.push('/dashboard')
    } catch (err: any) {
        console.error('Login error:', err)
        error.value = err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.'
    }
}
</script>

<template>
    <div style="display: grid; place-items: center; min-height: 100vh; padding: 24px">
        <n-card style="max-width: 420px; width: 100%" title="Вход">
            <n-form @submit.prevent="handleSubmit">
                <n-form-item v-if="error" style="margin-bottom: 16px">
                    <n-alert type="error" :show-icon="false">
                        {{ error }}
                    </n-alert>
                </n-form-item>

                <n-form-item label="Email">
                    <n-input
                        v-model:value="email"
                        type="text"
                        placeholder="you@example.com"
                        autofocus
                        :disabled="auth.loading"
                    />
                </n-form-item>

                <n-form-item label="Пароль">
                    <n-input
                        v-model:value="password"
                        type="password"
                        placeholder="••••••••"
                        :disabled="auth.loading"
                        @keydown.enter="handleSubmit"
                    />
                </n-form-item>

                <div style="display: flex; justify-content: flex-end; gap: 8px">
                    <n-button
                        type="primary"
                        :loading="auth.loading"
                        attr-type="submit"
                        :disabled="!email || !password"
                    >
                        Войти
                    </n-button>
                </div>
            </n-form>
        </n-card>
    </div>
</template>
