<script setup lang="ts">
import { NLayoutHeader, NButton, NSpace, NDropdown, NAvatar, useMessage } from 'naive-ui'
import { useUiStore } from '@/stores/ui/ui.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useRouter } from 'vue-router'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()
const message = useMessage()

const userMenuOptions = [
    {
        label: 'Выход',
        key: 'logout',
    },
]

async function handleUserMenuSelect(key: string) {
    if (key === 'logout') {
        try {
            await auth.logout()
            message.success('Вы вышли из системы')
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            message.error('Ошибка при выходе')
        }
    }
}
</script>

<template>
    <n-layout-header bordered style="height: 56px; padding: 0 16px">
        <n-space justify="space-between" align="center">
            <div>Laravel Test</div>

            <n-space>
                <n-button size="small" @click="ui.toggleTheme">Toggle theme</n-button>

                <template v-if="auth.user">
                    <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                        <n-button text>
                            <n-avatar :size="24" round style="margin-right: 8px">
                                {{ auth.user.name.charAt(0).toUpperCase() }}
                            </n-avatar>
                            <div
                                style="
                                    display: flex;
                                    flex-direction: column;
                                    align-items: flex-start;
                                "
                            >
                                <span>{{ auth.user.name }}</span>
                                <span
                                    style="font-size: 11px; opacity: 0.7"
                                    v-if="auth.user.roles?.length"
                                >
                                    {{ auth.user.roles.join(', ') }}
                                </span>
                            </div>
                        </n-button>
                    </n-dropdown>
                </template>
            </n-space>
        </n-space>
    </n-layout-header>
</template>
