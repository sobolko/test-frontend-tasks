<script setup lang="ts">
import { NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const menuOptions = computed(() => [
    {
        label: 'Dashboard',
        key: '/dashboard',
    },
    {
        label: 'Задачи',
        key: '/tasks',
    },
    ...(authStore.isAdmin
        ? [
              {
                  label: 'Статистика',
                  key: '/statistics',
              },
          ]
        : []),
])

function handleSelect(key: string) {
    router.push(key)
}
</script>

<template>
    <n-menu :options="menuOptions" :default-value="$route.path" @update:value="handleSelect" />
</template>
